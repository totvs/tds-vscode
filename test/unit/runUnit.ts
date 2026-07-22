import { run } from "./suite/index";

run()
  .then(() => {
    console.log("unit suite ok");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
