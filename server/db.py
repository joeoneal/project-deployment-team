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
        self.cursor.execute("SELECT * FROM projects")
        rows = self.cursor.fetchall()
        all = []
        for row in rows: 
            d = dict_factory(self.cursor, row)
            all.append(d)
        return all
    
    def getRecord(self, id):
        self.cursor.execute("SELECT * FROM projects WHERE id = ?", [id])
        row = self.cursor.fetchone()
        if row:
            d = dict_factory(self.cursor, row)
            return d
        return None
    
    def saveRecord(self, record):
        data = [record["title"], record["client"], record["due_date"], record["description"]]
        self.cursor.execute("INSERT INTO projects (name, client, due_date, description) VALUES (?, ?, ?, ?)", data)
        self.connection.commit()

    def deleteRecord(self, id):
        print("calling delete")
        self.cursor.execute("DELETE FROM projects WHERE id = ?", [id])
        self.connection.commit()

    def editRecord(self, id, d):
        print('calling edit func')
        data = [d["name"], d["client"], d["due-date"], d["description"], id]
        self.cursor.execute("UPDATE projects SET name=?, client=?, due_date=?, description=? WHERE id=?;", data)
        self.connection.commit()
        
    def floodDB(self):
        print('filling database with projects')
        self.cursor.execute("INSERT INTO projects (name, client, due_date, description) VALUES ('E-commerce Website Redesign', 'Willow Creek Boutique', '12/01/2025', 'Complete overhaul of the existing Shopify store. Focus on mobile-first UX and faster checkout.')")
        self.cursor.execute("INSERT INTO projects (name, client, due_date, description) VALUES ('Mobile App (iOS & Android)', 'FitLife Trackers', '02/15/2026', 'Native fitness tracking app. Will include GPS run mapping, calorie counting, and social sharing.')")
        self.cursor.execute("INSERT INTO projects (name, client, due_date, description) VALUES ('Cloud Migration Strategy', 'Acme Analytics Inc.', '11/30/2025', 'Develop a phased migration plan to move on-premise data servers to AWS S3 and EC2.')")
        self.cursor.execute("INSERT INTO projects (name, client, due_date, description) VALUES ('Brand Identity Package', 'Sunrise Coffee Co.', '11/15/2025', 'Design new logo, color palette, typography, and packaging mockups for a new coffee roaster.')")
        self.cursor.execute("INSERT INTO projects (name, client, due_date, description) VALUES ('SEO & Content Marketing Plan', 'Dr. Evans Dentistry', '01/01/2026', '6-month content calendar and keyword optimization strategy to improve local search ranking.')")
        self.cursor.execute("INSERT INTO projects (name, client, due_date, description) VALUES ('Internal CRM Dashboard', 'SalesForce (Internal)', '03/01/2026', 'Build a React-based dashboard to visualize sales KPIs and integrate with the main Salesforce API.')")
        self.cursor.execute("INSERT INTO projects (name, client, due_date, description) VALUES ('Investor Pitch Deck', 'QuantumLeap AI', '11/10/2025', 'Create a compelling 20-slide pitch deck for Series A funding round. Includes market analysis.')")
        self.cursor.execute("INSERT INTO projects (name, client, due_date, description) VALUES ('HR Onboarding Portal', 'MediCorp', '04/10/2026', 'Develop a secure web portal for new hires to complete paperwork, watch training videos, and sign HR documents.')")
        self.cursor.execute("INSERT INTO projects (name, client, due_date, description) VALUES ('Q4 Social Media Campaign', 'OceanBlue Resorts', '12/05/2025', 'Run a holiday promotional campaign across Instagram and TikTok, focusing on user-generated content.')")
        self.cursor.execute("INSERT INTO projects (name, client, due_date, description) VALUES ('Warehouse Automation PLC', 'BigBox Logistics', '05/01/2026', 'Program PLC (Programmable Logic Controller) for a new automated conveyor belt sorting system.')")
        self.connection.commit()
        self.connection.close()


# db = DB('projects.db')
# db.floodDB()