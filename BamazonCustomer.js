var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "exWHYzee123", //Your password
    database: "Bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

var start = function() {
	connection.query('SELECT * FROM Products', function(err, res) {
		console.log(res);
		
		inquirer.prompt({
			name: "choice",
			message: "Type the ItemID you want to buy",
			type: "input"
		}).then(function(answer) {
			for (var i = 0; i < res.length; i++) {
				if (res[i].ItemID == answer.choice) {
					var chosenItem = res[i];
					console.log(chosenItem);
					inquirer.prompt({
						name: "quantity",
						message: "How many?",
						type: "input"
					}).then(function(answer) {
						if (chosenItem.StockQuantity > parseInt(answer.quantity)) {
							var updated = chosenItem.StockQuantity - answer.quantity;
							var price = answer.quantity * chosenItem.Price;
							connection.query("UPDATE Products SET ? WHERE ?", [{
								StockQuantity: updated
							}, {
								ItemID: chosenItem.ItemID
							}], function(err, res) {
								console.log("Purchase Successful!");
								console.log("Your purchase cost $" + price + ".");
								start();
							});	
						} else {
							console.log("Unfortunately we don't have enough stock to fulfill your order.  Would you like something else?");
							start();
						}
					})
				}
			}

		})

		// connection.end(function(err) {
		// 	// The connection is terminated gracefully
		// 	// Ensures all previously enqueued queries are still
		// 	// before sending a COM_QUIT packet to the MySQL server.
		// })
	})
};

