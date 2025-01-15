import app from "./app.js";

app.listen(3000, () => {
  console.log(`app is listening at port:${process.env.PORT}`);
});
