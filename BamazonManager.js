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
    inquirer.prompt([{
	  type: 'list',
	  name: 'managerChoice',
	  message: 'Select a command',
	  choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
	}]).then(function(answers) {

	  if (answers.managerChoice === 'View Products for Sale') {
	  	viewProducts();
	  } else if (answers.managerChoice === 'View Low Inventory') {
	  	lowinventory();
	  } else if (answers.managerChoice === 'Add to Inventory') {
	  	addInventory();
	  } else if (answers.managerChoice === 'Add New Product') {
	  	addProduct();
	  }
	});
};

var viewProducts = function() {
	connection.query('SELECT * FROM Products', function(err, res) {
		console.log(res);
	})

	connection.end(function(err) {
		// The connection is terminated gracefully
		// Ensures all previously enqueued queries are still
		// before sending a COM_QUIT packet to the MySQL server.
	})
};

var lowinventory = function() {

	connection.query('SELECT * FROM Products WHERE StockQuantity < 100', function(err, res) {
		console.log(res);
	})

	connection.end(function(err) {
		// The connection is terminated gracefully
		// Ensures all previously enqueued queries are still
		// before sending a COM_QUIT packet to the MySQL server.
	})
}

var addInventory = function() {
	connection.query('SELECT * FROM Products', function(err, res) {
		inquirer.prompt({
			name: "choice",
			message: "Type the ItemID you want to add inventory to.",
			type: "input"
		}).then(function(answer) {
			for (var i = 0; i < res.length; i++) {
				if (res[i].ItemID == answer.choice) {
					var chosenItem = res[i];
					console.log(chosenItem);
					inquirer.prompt({
						name: "quantity",
						message: "How many do you want to add?",
						type: "input"
					}).then(function(answer) {
						if (parseInt(answer.quantity) > 0) {
							var updated = chosenItem.StockQuantity + parseInt(answer.quantity);
							connection.query("UPDATE Products SET ? WHERE ?", [{
								StockQuantity: updated
							}, {
								ItemID: chosenItem.ItemID
							}], function(err, res) {
								console.log("Inventory Added!");
								connection.end(function(err) {
									// The connection is terminated gracefully
									// Ensures all previously enqueued queries are still
									// before sending a COM_QUIT packet to the MySQL server.
								})
							});
						} else {
								console.log("Invalid number.  Would you like to do anything else?");
								start();
						}
					})
				} else {
					console.log("There is nothing in inventory with that ItemID.  Do you want to do anything else?");
					start();
				}
			}
		})
	})
};

var addProduct = function() {

	inquirer.prompt([

		{
			name: "name",
			message: "What is the product name?",
			type: "input"
		},

		{
			name: "dept",
			message: "What is the department name?",
			type: "input"
		},

		{
			name: "price",
			message: "What is the price of the product?",
			type: "input"
		},

		{
			name: "quantity",
			message: "How many do you want to add?",
			type: "input"
		}

	]).then(function (answer) {

		if (parseInt(answer.quantity) <= 0) {
			console.log("Invalid quantity amount.  Do you want to do anything else?");
			start();
		} else if (parseInt(answer.price) <= 0){
			console.log("Invalid Price.  Do you want to do anything else?");
			start();
		} else {
		 	connection.query('INSERT INTO Products(ProductName, DepartmentName, Price, StockQuantity) VALUES(?, ?, ?, ?)', [answer.name, answer.dept, answer.price, answer.quantity], function(err, res) {
				console.log("Item added successfully!");
				connection.end(function(err) {
					// The connection is terminated gracefully
					// Ensures all previously enqueued queries are still
					// before sending a COM_QUIT packet to the MySQL server.
				})
			})
		}
	})
};
