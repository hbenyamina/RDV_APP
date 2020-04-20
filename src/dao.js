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
                console.log('Echec de la connexion a la base de donne\u0301es', err)
                console.log(err);

            } else {
                console.log('Connecte\u0301 a la base de donne\u0301es')
            }
        })
    }

    insert(element) {

        if (element instanceof Patient) {
            const sql = 'INSERT INTO Patient(ID,Nom,Prenom,Addresse,Tel,Mail,Infomed) VALUES(?,?,?,?,?,?,?);';
            return new Promise((resolve, reject) => {
                this.db.run(sql, [element.ID, element.Nom, element.Prenom, element.Addresse, element.Tel, element.Mail, element.InfoMed], (err) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve('Le Patient a e\u0301te\u0301 ajoute\u0301 avec succe\u0300s');
                        return 'Patient';
                    }
                });
            });

        } else if (element instanceof RENDEZVS) {
            const sql = 'INSERT INTO RendezVS(IDPAT,DateHeure,Objet) VALUES(?,?,?);';
            return new Promise((resolve, reject) => {
                this.db.run(sql, [element.IDPat, element.DateHeure, element.Objet], (err) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve('Le RDV a e\u0301te\u0301 ajoute\u0301 avec succe\u0300s');
                        return 'Rendez-vous';
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
                        resolve('Le Patient a e\u0301te\u0301 modifie\u0301 avec succe\u0300s');
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
                        resolve('Le RDV a e\u0301te\u0301 modifie\u0301 avec succe\u0300s');
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
                    resolve('Le rendez-vous a e\u0301te\u0301 supprime\u0301 avec succe\u0300s');
                }
            });
        });
    }



    getAllPatients() { //Returns a list of patient instances.
        const sql = "SELECT * FROM Patient";
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {

                if (err) {
                    reject(err.message);
                } else {
                    let listpatient = [];
                    rows.forEach(e => {
                        listpatient.push(new Patient(e.Nom, e.Prenom, e.Addresse, e.Tel, e.Mail, e.Infomed, e.ID));
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

                    resolve(new Patient(res.Nom, res.Prenom, res.Addresse, res.Tel, res.Mail, res.Infomed, res.ID));
                }

            });
        });

    }

    getRendezVSByNomPrenom(Nom, Prenom) { //Returns a list of patient instances.
        const sql = "SELECT RendezVS.* ,substr(DateHeure,0,11) as Date FROM RendezVS join Patient on RendezVS.IDPAT = Patient.ID WHERE Patient.Nom = ? and Patient.Prenom= ?";
        return new Promise((resolve, reject) => {
            this.db.all(sql, [Nom, Prenom], (err, rows) => {

                if (err) {
                    reject(err.message);
                } else {
                    let listpatient = [];
                    console.log(rows);

                    rows.forEach(res => {
                        listpatient.push(new RENDEZVS(res.IDPAT, res.Date, res.Objet, res.ID));
                    });

                    resolve(listpatient);
                }

            });
        });

    }

    getRdvPatient(ID) { //Returns a list of rendezvs instances for a specific patient.
        const sql = "SELECT * FROM RendezVS WHERE IDPAT = ?";
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
        const sql = 'SELECT * FROM RendezVS WHERE DateHeure LIKE ?';
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
        let date = today.getDate() + '-' + (today.getMonth() + 1).toString().padStart(2, "0") + '-' + today.getFullYear() + '%';
        console.log(date);
        const sql = 'SELECT * FROM RendezVS WHERE DateHeure LIKE ?';
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

    getRdvInfoByID(ID) {
        const sql = 'SELECT DateHeure,Objet,Nom,Prenom FROM RENDEZVS AS r JOIN Patient as p ON r.ID = p.ID WHERE r.ID = ?';
        return new Promise((resolve, reject) => {
            this.db.get(sql, [ID], (err, result) => {

                if (err) {
                    reject(err.message);
                } else {

                    resolve(result);
                }

            });
        });
    }

    closeConnec() {
        console.log("trying to close the connection");

        this.db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connexion a la base de donn�es ferm�e.');
        });
    }


}

class Imprimante {
    constructor(dbInstance) {
        this.db = dbInstance;
    }

    imprimer(path, rdvID) {

        db.getRdvInfoByID(rdvID).then(e => {
            let dateHeure = e.DateHeure.split(' ')
            let text = `***************Cabinet Medical Echifaa***************
            \rRendez-Vous :

            \rLe : ${dateHeure[0]} a\u0300 ${dateHeure[1]}

            \rNom et pre\u0301nom du concerne\u0301 : ${e.Nom} ${e.Prenom}

            \rObjet : ${e.Objet}
            
            \r***************Veuillez respecter les heures SVP******
            `;
            fs.writeFile(path, text, e => {
                if (e) {
                    return "Erreur lors de l'impression du Rendez-Vous"
                }
            });

        });
    }
}


module.exports = {
    Patient,
    RENDEZVS,
    AppDAO,
    Imprimante
}


//let db = new AppDAO("./db/rdv.db");
//let imp = new Imprimante(db);
//imp.imprimer('rdv.txt',2);
//db.closeConnec();



//Press any key to exit logic
//process.stdin.setRawMode(true);
//process.stdin.resume();
//process.stdin.on('data', process.exit.bind(process, 0));