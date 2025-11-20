import sqlite3

def dict_factory(cursor, row):
    fields = []
    # Extract column names from cursor description
    for column in cursor.description:
        fields.append(column[0])

    # Create a dictionary where keys are column names and values are row values
    result_dict = {}
    for i in range(len(fields)):
        result_dict[fields[i]] = row[i]

    return result_dict

class DB:
    def __init__(self, dbfilename):
        self.dbfilename = dbfilename
        self.connection = sqlite3.connect(dbfilename)
        self.cursor = self.connection.cursor()

    def readAllRecords(self):
        self.cursor.execute("SELECT * FROM tickets")
        rows = self.cursor.fetchall()
        all = []
        for row in rows: 
            d = dict_factory(self.cursor, row)
            all.append(d)
        return all
    
    def getRecord(self, id):
        self.cursor.execute("SELECT * FROM tickets WHERE id = ?", [id])
        row = self.cursor.fetchone()
        if row:
            d = dict_factory(self.cursor, row)
            return d
        return None

    def saveRecord(self, record):
        data = [record["title"], record["urgency"], record["status"]]
        self.cursor.execute("INSERT INTO tickets (title, urgency, status) VALUES (?, ?, ?)", data)
        self.connection.commit()

    def deleteRecord(self, id):
        print("calling delete")
        self.cursor.execute("DELETE FROM tickets WHERE id = ?", [id])
        self.connection.commit()

    def editRecord(self, id, record):
        print('calling edit func')
        data = [record["title"], record["urgency"], record["status"], id]
        self.cursor.execute("UPDATE tickets SET title=?, urgency=?, status=? WHERE id=?;", data)
        self.connection.commit()

    def createUser(self, first_name, last_name, email, password_encrypted):
        data = [first_name, last_name, email, password_encrypted]
        try:
            self.cursor.execute("INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)", data)
            self.connection.commit()
            return self.cursor.lastrowid # Returns the new User ID
        except sqlite3.IntegrityError:
            return None # Returns None if email is duplicate
    
    def get_user_by_email(self, email):
        self.cursor.execute("SELECT * FROM users WHERE email = ?", [email])
        row = self.cursor.fetchone()
        if row:
            d = dict_factory(self.cursor, row)
            return d
        return None