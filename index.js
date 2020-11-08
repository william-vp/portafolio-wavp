const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const cors = require("cors")
require('dotenv').config({path: 'var.env'})
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const optionsCors = {origin: process.env.FRONTEND_URL}
app.use(cors(optionsCors));

app.get("/api/form", () => console.log("get"))

app.post("/api/form", (req, res) => {
    console.log("form")
    nodemailer.createTestAccount((err, account) => {
        const htmlEmail = `
    <main style="width: 100%;font-family: monospace;color: #333;">
        <div style="width: 100%; padding: 10px; align-items: center;background: #eee;">
            <div style="width: 85%; margin: auto;
            align-self: center; padding: 20px; background: #FFF; border-radius: 15px; box-shadow: 0 0 1px rgba(0,0,0,.2);">
    
                <p>
                    Mensaje de <strong>${req.body.email}</strong>
                </p>
                <h2 style="">${req.body.subject}</h2>
    
                <p>${req.body.message}</p>
                
                <hr style="border-color: #ccc; border-width: .6px;">
                Mensaje enviado desde Portafolio William Viteri
            </div>
        </div>
    </main>`;


        let transporter = nodemailer.createTransport({
            host: process.env.HOST_NODEMAILER,
            port: process.env.PORT_NODEMAILER,
            secure: false,
            auth: {
                user: process.env.USER_NODEMAILER,
                pass: process.env.PASS_NODEMAILER
            }
        });

        let mailOptions = {
            from: "contact@portafoli_wavp.com",
            to: "wavp25@gmail.com",
            replyTo: "",
            subject: req.body.subject,
            text: req.body.message,
            html: htmlEmail
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                return res.status(200).json({
                    msg: "Ha ocurrido un error enviando el mensaje. Intenta nuevamente por favor",
                    success: false
                })
            } else {
                if (info) console.info(info)
                return res.status(200).json({msg: "Mensaje Enviardo. Gracias por contactarme!", success: true})
            }
        })
    })
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log("Servidor iniciado")
})
