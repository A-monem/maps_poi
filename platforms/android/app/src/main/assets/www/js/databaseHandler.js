let databaseHandler = {
    db: null,
    createDatabase: function () {
        this.db = window.openDatabase("poi.db", "1.0", "poi database", 1000000);
        this.db.transaction(function (tx) {
            //create a markers table
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS markers(markerId integer primary key, lat decimal, lng decimal, addr text)",
                [],
                function (tx, results) {
                    console.log("success create markers table", results)
                },
                function (tx, error) {
                    console.log("Error while creating markers table: " + error.message);
                }
            );
            tx.executeSql(
                //create a notes table
                "CREATE TABLE IF NOT EXISTS notes(noteId integer PRIMARY KEY, note text, markerId integer, FOREIGN KEY (markerId) REFERENCES markers(markerId))",
                [],
                function (tx, results) {
                    console.log("results from create notes table ", results);
                },
                function (tx, error) {
                    console.log("Error while creating the notes table: " + error.message);
                }
            );
            tx.executeSql(
                //create a photos table
                "CREATE TABLE IF NOT EXISTS photos(photoId integer PRIMARY KEY, photoSrc text, markerId integer, FOREIGN KEY (markerId) REFERENCES markers(markerId))",
                [],
                function (tx, results) {
                    console.log("results from create photos table ", results);
                },
                function (tx, error) {
                    console.log("Error while creating the photos table: " + error.message);
                }
            );
        },
            function (error) {
                console.log("Create DB Transaction error: " + error.message);
            },
            function () {
                console.log("Create DB transaction completed successfully");
            }
        );

    }
};

let markerHandler = {
    id: null, //active marker id
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
                markerHandler.getMarker();
            }
        );
    },
    getMarker: function () {  //get a marker from DB
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM markers where markerId = ?",
                [markerHandler.id],
                function (tx, results) {
                    const result = results.rows[0];
                    console.log('result from getMarker', result);
                    document.getElementById("markerId").value = `${markerHandler.id}`;
                    document.getElementById("latitude").value = `${result.lat}`;
                    document.getElementById("longitude").value = `${result.lng}`;
                    document.getElementById("address").value = `${result.addr}`;
                },
                function (tx, error) {
                    console.log("get marker error: " + error.message);
                }
            );
        },
            function (error) {
                console.log("Transaction error: " + error.message);
            },
            function () {
                console.log("Transaction get marker successful");
            }
        );
    },
    getAllMarkers: function () { //get all markers from DB
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM markers",
                [],
                function (tx, results) {
                    const result = results.rows;
                    for (let i=0; i< result.length; i++){
                        mapHandler.createMarker(result[i].lat, 
                            result[i].lng, result[i].addr, result[i].markerId);
                    }
                },
                function (tx, error) {
                    console.log("get all markers error: " + error.message);
                }
            );
        },
            function (error) {
                console.log("Transaction get all markers error: " + error.message);
            },
            function () {
                console.log("Transaction get all markers successful");
            }
        );
    },
    deleteMarker: function () { //delete marker
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql("delete from markers where markerId = ?", 
                [markerHandler.id],
                function (tx, results) {
                    console.log('marker deleted', results);
                },
                function (tx, error) {
                    console.log("delete marker error: " + error.message);
                }
            );
            tx.executeSql("delete from notes where markerId = ?", //cascade deletes
                [markerHandler.id],
                function (tx, results) {
                    console.log('all notes deleted', results);
                },
                function (tx, error) {
                    console.log("delete all notes error: " + error.message);
                }
            );
            tx.executeSql("delete from photos where markerId = ?", //cascade deletes
                [markerHandler.id],
                function (tx, results) {
                    console.log('all photos deleted', results);
                },
                function (tx, error) {
                    console.log("delete all photos error: " + error.message);
                });
        },
            function (error) {
                console.log("Transaction delete marker error: " + error.message);
            },
            function () {
                console.log("Transaction delete marker successfully");
            }
        );
    },
    addNote: function () {
        let note = document.getElementById("textareaAddNote");
        note.value !== "" //check if note is empty
        ? databaseHandler.db.transaction(function (tx) { 
            tx.executeSql("INSERT INTO notes(note, markerId) VALUES(?, ?)",
                [note.value, markerHandler.id],
                function (tx, results) {
                    console.log("results from insert into note table", results.insertId);
                    note.value = "";    //reset textarea
                },
                function (tx, error) {
                    console.log("add note error: " + error.message);
                }
            );
        },
            function (error) {
                console.log("Transaction add note error: " + error.message);
            },
            function () {
                console.log("Transaction add note successful");
            }
        )
        : null   
    },
    getNote: function () {
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM notes where markerId=?",
                [markerHandler.id],
                function (tx, results) {
                    let ul = document.getElementById("listNotes");
                    ul.innerHTML = '';
                    const result = results.rows;
                    for (let i = 0; i < result.length; i++) {
                        const li = document.createElement("li");
                        li.classList.add("liNote");
                        const btn = document.createElement("button");
                        btn.classList.add("btnDeleteNote");
                        btn.appendChild(document.createTextNode("Delete Note"));
                        btn.addEventListener("click", () => {
                            markerHandler.deleteNote(result[i].noteId);
                            btn.parentNode.parentNode.removeChild(btn.parentNode)
                        });
                        li.appendChild(document.createTextNode(result[i].note));
                        li.appendChild(btn);
                        ul.appendChild(li);
                    }
                },
                function (tx, error) {
                    console.log("get note error: " + error.message);
                }
            );
        },
            function (error) {
                console.log("Transaction get notes error: " + error.message);
            },
            function () {
                console.log("Transaction get notes successfully");
            }
        );
    },
    deleteNote: function (id) { //delete a note
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql("delete from notes where noteId = ?",
                [id],
                function (tx, results) {
                    console.log('note deleted', results);
                },
                function (tx, error) {
                    console.log("delete note error: " + error.message);
                }
            );
        },
            function (error) {
                console.log("Transaction delete note error: " + error.message);
            },
            function () {
                console.log("Transaction delete note successfully");
            }
        );
    },
    addPhoto: function (fileLocation) {
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql("INSERT INTO photos(photoSrc, markerId) VALUES(?, ?)",
                [fileLocation, markerHandler.id],
                function (tx, results) {
                    console.log("results from insert into photos table successful", results);
                },
                function (tx, error) {
                    console.log("add photo source error: " + error.message);
                }
            );
        },
            function (error) {
                console.log("Transaction add photo error: " + error.message);
            },
            function () {
                console.log("Transaction photo successfully");
            }
        );
    },
    getPhoto: function () { 
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM photos where markerId=?",
                [markerHandler.id],
                function (tx, results) {
                    let div = document.getElementById("listPhotos");
                    div.classList.add("divCenter");
                    div.innerHTML = '';
                    const result = results.rows;
                    for (let i = 0; i < result.length; i++) { //create img and delete button from each photo
                        const img = document.createElement("img"); 
                        const btn = document.createElement("button"); 
                        btn.appendChild(document.createTextNode("Delete Photo"));
                        btn.classList.add("ui-btn");
                        btn.addEventListener("click", () => {
                            markerHandler.deletePhoto(result[i].photoId);
                            btn.parentNode.removeChild(img);
                            btn.parentNode.removeChild(btn);
                        });
                        img.src = result[i].photoSrc
                        div.appendChild(img);
                        div.appendChild(btn);
                    }
                },
                function (tx, error) {
                    console.log("get photo error: " + error.message);
                }
            );
        },
            function (error) {
                console.log("Transaction get photo error: " + error.message);
            },
            function () {
                console.log("Retreived notes successfully");
            }
        );
    },
    deletePhoto: function (id) {
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql("delete from photos where photoId = ?",
                [id],
                function (tx, results) {
                    console.log('photo deleted', results);
                },
                function (tx, error) {
                    console.log("delete photo error: " + error.message);
                }
            );
        },
            function (error) {
                console.log("Transaction delete photo error: " + error.message);
            },
            function () {
                console.log("Transaction delete photo successfully");
            }
        );
    },
};
