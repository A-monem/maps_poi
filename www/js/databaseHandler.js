let databaseHandler = {
    db: null,
    createDatabase: function () {
        this.db = window.openDatabase("poi.db", "1.0", "poi database", 1000000);
        this.db.transaction(function (tx) {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS markers(markerId integer primary key, lat decimal, lng decimal, addr text)",
                [],
                function (tx, results) {
                    console.log("results from create table ", results)
                    const msg = `Success creating markers table`
                    document.getElementById("status_1").innerText = msg;
                },
                function (tx, error) {
                    console.log("Error while creating the table: " + error.message);
                    const msg = `error creating markers table, ${error}`
                    document.getElementById("status_1").innerText = msg;
                }
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS notes(noteId integer PRIMARY KEY, note text, markerId integer, FOREIGN KEY (markerId) REFERENCES markers(markerId))",
                [],
                function (tx, results) {
                    console.log("results from create notes table ", results);
                    const msg = `success creating notes table`
                    document.getElementById("status_2").innerText = msg;
                },
                function (tx, error) {
                    console.log("Error while creating the notes table: " + error.message);
                    const msg = `error creating notes table, ${error}`
                    document.getElementById("status_2").innerText = msg;
                }
            );
        },
            function (error) {
                console.log("Transaction error: " + error.message);
            },
            function () {
                console.log("Create DB transaction completed successfully");
            }
        );

    }
};

let markerHandler = {
    id: null,
    addMarker: function (lat, lng, addr) {
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql("INSERT INTO markers(lat, lng, addr) VALUES(?, ?, ?)",
                [lat, lng, addr],
                function (tx, results) {
                    console.log("results from insert into table", results.insertId);
                    markerHandler.id = results.insertId;
                    mapHandler.createMarker(lat, lng, addr, markerHandler.id);
                },
                function (tx, error) {
                    console.log("add marker error: " + error.message);
                }
            );
        },
            function (error) {
                console.log("Transaction error: " + error.message);
            },
            function () {
                markerHandler.getMarker(markerHandler.id);
            }
        );
    },
    getMarker: function (id) {
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM markers where markerId = ?",
                [id],
                function (tx, results) {  
                    // if (id === undefined) {
                    //     id = markerHandler.id;
                    // } else {
                    //     markerHandler.id = id;
                    // }

                    // const result = results.rows.item(markerHandler.id - 1);
                    const result = results.rows[0];
                    const msg = `result, ${result}`
                    document.getElementById("status_1").innerText = msg;
                    console.log('result from getMarker', result);
                    document.getElementById("markerId").innerText = ` id: ${id}`;
                    document.getElementById("latitude").innerText = ` latitude: ${result.lat}`;
                    document.getElementById("longitude").innerText = ` longitude: ${result.lng}`;
                    document.getElementById("address").innerText = ` address: ${result.addr}`;
                },
                function (tx, error) {
                    console.log("get marker error: " + error.message);
                    const msg = `read error, ${error}`
                    document.getElementById("status_1").innerText = msg;
                }
            );
        },
            function (error) {
                console.log("Transaction error: " + error.message);
                const msg_2 = `transaction error, ${error.message}`
                document.getElementById("status_2").innerText = msg_2;
            },
            function () {
                console.log("Retreived values successfully");
                const msg_2 = `Retreived values successfully`
                document.getElementById("status_2").innerText = msg_2;
            }
        );
    },
    deleteMarker: function (id) {
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql("delete from markers where markerId = ?",
                [id],
                function (tx, results) {
                    const msg = `deleted`
                    document.getElementById("status_1").innerText = msg;
                    console.log('marker deleted', results);
                },
                function (tx, error) {
                    console.log("delete marker error: " + error.message);
                    const msg = `delete error, ${error.message}`
                    document.getElementById("status_1").innerText = msg;
                }
            );
        },
            function (error) {
                console.log("Transaction error: " + error.message);
                const msg_2 = `transaction error, ${error}`
                document.getElementById("status_2").innerText = msg_2;
            },
            function () {
                console.log("Retreived values successfully");
                const msg_2 = `Deleted successfully`
                document.getElementById("status_2").innerText = msg_2;
            }
        );
    }, 
    addNote: function () {
        let note = document.getElementById("textareaAddNote");
        databaseHandler.db.transaction(function(tx) {
            tx.executeSql("INSERT INTO notes(note, markerId) VALUES(?, ?)",
                [note.value, markerHandler.id],
                function (tx, results) {
                    console.log("results from insert into note table", results.insertId);
                    const msg = `success adding note`
                    document.getElementById("status_2").innerText = msg;
                    note.value = "";
                },
                function (tx, error) {
                    console.log("add note error: " + error.message);
                    const msg_2 = `error adding note`
                    document.getElementById("status_2").innerText = msg_2;
                }
            );
        },
            function (error) {
                console.log("Transaction add note error: " + error.message);
                const msg_2 = `error transaction adding note`
                document.getElementById("status_2").innerText = msg_2;
            },
            function () {
                console.log("Inserted note successfully");
                const msg = `success transaction adding note`
                document.getElementById("status_1").innerText = msg;
            }
        );
            
    },
    getNote: function (id) {
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM notes where markerId=?",
                [id],
                function (tx, results) {  
                    let ul = document.getElementById("listNotes");
                    ul.innerHTML = '';
                    const result = results.rows;
                    for (let i=0; i< result.length; i++){
                        const li = document.createElement("li");
                        li.appendChild(document.createTextNode(result[i].note));
                        ul.appendChild(li);
                    }
                    // results.rows.forEach( (row) => {
                    //     const li = document.createElement("li");
                    //     li.appendChild(document.createTextNode(row.note));
                    //     ul.appendChild(li);
   
                    // });

                },
                function (tx, error) {
                    console.log("get note error: " + error.message);
                    const msg = `read error, ${error.message}`
                    document.getElementById("status_1").innerText = msg;
                }
            );
        },
            function (error) {
                console.log("Transaction error: " + error.message);
                const msg_2 = `transaction error, ${error.message}`
                document.getElementById("status_2").innerText = msg_2;
            },
            function () {
                console.log("Retreived notes successfully");
                const msg_2 = `Retreived notes successfully`
                document.getElementById("status_2").innerText = msg_2;
            }
        );
    },
};
