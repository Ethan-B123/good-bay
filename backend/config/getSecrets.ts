export default function() {
  if(process.env.IS_PRODUCTION === "true") {
    return {
      jwtSecret: process.env.JWT_SECRET
    }
  } else {
    return {
      jwtSecret: require("./secrets")
    }
  }
}