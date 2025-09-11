import  arcjet, {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow
} from "@arcjet/next"
import { env } from "./env"

import "server-only"



export {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow
}





export default arcjet({
    key : env.ARCJET_API_KEY,

    characteristics: ["fingerprint"],

    // define base rules here, can also be empty if you don't want to have any rules
    rules: [
        
    
        shield({
            mode: "LIVE"
        }),
      
    ]
})