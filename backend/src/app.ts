import "reflect-metadata";
import { createConnection } from "typeorm";
import { init as userRouteInit } from "./routes/User";
import * as bodyParser from "body-parser";
import * as express from "express";

// https://github.com/whitecolor/ts-node-dev/issues/71
process.on("SIGTERM", () => process.kill(process.pid, "SIGINT"));

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//

(async () => {
  const connection = await createConnection();

  app.use("/users", userRouteInit(connection));

  app.listen(5000, () => {
    console.log("5000");
  });
})();

// createConnection()
// 	.then(async connection => {
// 		console.log('Inserting a new user into the database...');
// 		const user = new User();
// 		user.age = 25;
// 		user.email = 'e.mail';
// 		user.username = 'user';
// 		await connection.manager.save(user);
// 		console.log('Saved a new user with id: ' + user.id);

// 		console.log('Loading users from the database...');
// 		const repository = connection.getRepository(User);
// 		const users = await repository.find();
// 		console.log('Loaded users: ', users);

// 		console.log('Here you can setup and run express/koa/any other framework.');
// 	})
// 	.catch(error => console.log(error));
