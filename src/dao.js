'use strict';
const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');
const fs = require('fs');

//Classes to organise queries
class Patient {
    constructor(Nom, Prenom, Addresse, Tel, Mail, InfoMed, ID = null) {
        this.ID = ID;
        this.Nom = Nom;
        this.Prenom = Prenom;
        this.Addresse = Addresse;
        this.Tel = Tel;
        this.Mail = Mail;
        this.InfoMed = InfoMed;
    }

}

class RENDEZVS {
    constructor(IDPat, DateHeure, Objet, ID = null) {
        this.ID = ID;
        this.IDPat = IDPat;
        this.DateHeure = DateHeure;
        this.Objet = Objet;
    }
}


//A class to manipulate the database

class AppDAO {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.log('Echec de la connexion a la base de données', err)
            } else {
                console.log('Connecté a la base de données')
            }
        })
    }

    insert(element) {
       
        if (element instanceof Patient) {
            const sql = 'INSERT INTO PATIENT(Nom,Prenom,Addresse,Tel,Mail,Infomed) VALUES(?,?,?,?,?,?);';
            return new Promise((resolve, reject) => {
                this.db.run(sql, [element.Nom, element.Prenom, element.Addresse, element.Tel, element.Mail, element.InfoMed], (err) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve('Le Patient a été ajouté avec succès');
                    }
                });
            });

        } else if (element instanceof RENDEZVS) {
            const sql = 'INSERT INTO RENDEZVS(IDPAT,DateHeure,Objet) VALUES(?,?,?);';
            return new Promise((resolve, reject) => {
                this.db.run(sql, [element.IDPat, element.DateHeure, element.Objet], (err) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve('Le RDV a été ajouté avec succès');
                    }
                });
            });
        }
    }

    update(element) {
        if (element instanceof Patient) {
            const sql = 'UPDATE Patient SET Nom = ?,Prenom = ?,Addresse = ?,Tel = ?,Mail = ?,Infomed = ? WHERE ID = ?';

            return new Promise((resolve, reject) => {
                this.db.run(sql, [element.Nom, element.Prenom, element.Addresse, element.Tel, element.Mail, element.InfoMed, element.ID], (err) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve('Le Patient a été modifié avec succès');
                    }
                });
            });

        } else if (element instanceof RENDEZVS) {
            const sql = 'UPDATE RendezVS SET DateHeure = ?,Objet = ? WHERE ID = ?'; //Only Date/Time and Subject are updatable

            return new Promise((resolve, reject) => {
                this.db.run(sql, [element.DateHeure, element.Objet, element.ID], (err) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve('Le RDV a été modifié avec succès');
                    }
                });
            });
        }
    }

    delete(ID) { // The function only removes Rendez-Vous
        
            return new Promise((resolve, reject) => {
                const sql = 'DELETE FROM RendezVS WHERE ID= ?';

                this.db.run(sql, [ID], (err) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve('Le rendez-vous a été supprimé avec succès');
                    }
                });
            });  
    }



    getAllPatients() { //Returns a list of patient instances.
        const sql = "SELECT * FROM Patient";
        return new Promise((resolve, reject) => {
            this.db.all(sql, [],(err, rows) => {

                if (err) {
                    reject(err.message);
                } else {
                    let listpatient = [];
                    rows.forEach(e => {
                        listpatient.push(new Patient(e.NOM, e.PRENOM, e.ADDRESSE, e.TEL, e.MAIL, e.INFOMED, e.ID));
                    });

                    resolve(listpatient);
                }

            });
        });
       
    }

    getPatientByID(ID) { //Returns a patient from id;
        const sql = "SELECT * FROM Patient WHERE ID = ?";
        return new Promise((resolve, reject) => {
            this.db.get(sql, [ID], (err, res) => {

                if (err) {
                    reject(err.message);
                } else {

                    resolve(new Patient(res.NOM, res.PRENOM, res.ADDRESSE, res.TEL, res.MAIL, res.INFOMED, res.ID));
                }

            });
        });

    }

    getRdvPatient(ID) { //Returns a list of rendezvs instances for a specific patient.
        const sql = "SELECT * FROM RENDEZVS WHERE IDPAT = ?";
        return new Promise((resolve, reject) => {
            this.db.all(sql, [ID], (err, rows) => {

                if (err) {
                    reject(err.message);
                } else {

                    let listrdv = [];
                    rows.forEach(e => {
                        listrdv.push(new RENDEZVS(e.IDPAT, e.DateHeure, e.Objet, e.ID));
                    });

                    resolve(listrdv);
                }

            });
        });

    }

    getRdvJour(Date) {
        Date = Date + '%'
        const sql = 'SELECT * FROM RENDEZVS WHERE DateHeure LIKE ?';
        return new Promise((resolve, reject) => {
            this.db.all(sql, [Date], (err, rows) => {

                if (err) {
                    reject(err.message);
                } else {

                    let listrdv = [];
                    rows.forEach(e => {
                        listrdv.push(new RENDEZVS(e.IDPAT, e.DateHeure, e.Objet, e.ID));
                    });

                    resolve(listrdv);
                }

            });
        });
    }

    getRdvAujourd() { // Returns the rendez-vous of today
        let today = new Date();
        let date = today.getDate() + '-' + (today.getMonth() + 1).toString().padStart(2,"0") + '-' + today.getFullYear() + '%';
        console.log(date);
        const sql = 'SELECT * FROM RENDEZVS WHERE DateHeure LIKE ?';
        return new Promise((resolve, reject) => {
            this.db.all(sql, [date], (err, rows) => {

                if (err) {
                    reject(err.message);
                } else {

                    let listrdv = [];
                    rows.forEach(e => {
                        listrdv.push(new RENDEZVS(e.IDPAT, e.DateHeure, e.Objet, e.ID));
                    });

                    resolve(listrdv);
                }

            });
        });
    }

    closeConnec() {
        this.db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connexion a la base de données fermée.');
        });
    }


}



let db = new AppDAO("./db/rdv.db");
let res;
res = db.getRdvAujourd().then(e => { return e; }); // Use it like this ,the e changes from function to function ,it can be a msg or a list of objects
console.log(res);
db.closeConnec();

//Press any key to exit logic
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));