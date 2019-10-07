let databaseHandler = {
    db: null,
    createDatabase: function () {
        this.db = window.openDatabase("poi.db", "1.0", "poi database", 1000000);
        this.db.transaction(function (tx) {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS markers(_id integer primary key, lat decimal, lng decimal, addr text)",
                [],
                function (tx, results) {
                    console.log("results from create table ", results)
                },
                function (tx, error) {
                    console.log("Error while creating the table: " + error.message);
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
                    // mapHandler.addMarker(lat, lng, addr, markerHandler.id);
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
                console.log("Inserted values successfully");
            }
        );
    },
    getMarker: function (id) {
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM markers",
                [],
                function (tx, results) {
                    if (id === undefined) {
                        result = results.rows.item(markerHandler.id - 1);
                    } else {
                        result = results.rows.item(id - 1);
                    }
                    const msg = `result, ${result}`
                    document.getElementById("status_1").innerText = msg;
                    console.log('result from getMarker', result);
                    document.getElementById("markerId").innerText = `latitude: ${markerHandler.id}`;
                    document.getElementById("latitude").innerText = `latitude: ${result.lat}`;
                    document.getElementById("longitude").innerText = `longitude: ${result.lng}`;
                    document.getElementById("address").innerText = `address: ${result.addr}`;
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
                const msg_2 = `transaction error, ${typeof (error)}`
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
            tx.executeSql("delete from markers where id = ?",
                [id],
                function (tx, results) {
                    const msg = `deleted`
                    document.getElementById("status_1").innerText = msg;
                    console.log('marker deleted', results);
                },
                function (tx, error) {
                    console.log("delete marker error: " + error.message);
                    const msg = `delete error, ${error}`
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
    }

};