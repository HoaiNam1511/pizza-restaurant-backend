"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formEmail = void 0;
const moment_1 = __importDefault(require("moment"));
const formEmail = ({ customerName, time, date, partySize, href, }) => {
    const emailHTML = `
    <table
    align="center"
    bgcolor="#fffffe"
    cellpadding="0"
    cellspacing="0"
    style="
        width: 740px;
        padding: 30px 45px;
        margin-top: 20px;
        border-radius: 7px;
        font-family: Arial, Helvetica, sans-serif;
        border: 1px solid #e0e0e0;
    "
    width="650"
>
    <tbody>
        <tr bgcolor="#fffffe">
            <td>
                <h1 style="text-align: center; margin-top: 20px">
                    Thank for your booking request
                </h1>
            </td>
        </tr>
        <tr>
            <td>

                <p
                    style="
                        height: 1px;
                        width: 100%;
                        background-color: #e0e0e0;
                        margin: 25px 0px;
                        line-height: 18px;
                    "
                ></p>

                <p style="margin: 8px 0px; font-size: 14px">
                    <strong
                        style="min-width: 120px; display: inline-block"
                        >Name</strong
                    >
                    ${customerName}
                </p>
                
                <p style="margin: 8px 0px; font-size: 14px">
                    <strong
                        style="min-width: 120px; display: inline-block"
                        >No. of guest</strong
                    >
                    ${partySize}
                </p>
                <p style="margin: 8px 0px; font-size: 14px">
                    <strong
                        style="min-width: 120px; display: inline-block"
                        >Date</strong
                    >
                    ${(0, moment_1.default)(date, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                </p>
                <p style="margin: 8px 0px; font-size: 14px">
                    <strong
                        style="min-width: 120px; display: inline-block"
                        >Time</strong
                    >
                    ${time}
                </p>
                <p style="margin: 8px 0px; font-size: 14px">
                    <strong
                        style="min-width: 120px; display: inline-block"
                        >Restaurant</strong
                    >
                    Hoai Nam Pizza
                </p>
                <p style="margin: 8px 0px; font-size: 14px">
                    <strong
                        style="min-width: 120px; display: inline-block"
                        >Location</strong
                    >
                    198 West 21th Street, Suite 721 New York NY 10016
                </p>
                <p
                    style="
                        height: 1px;
                        width: 100%;
                        background-color: #e0e0e0;
                        margin: 25px 0px;
                    "
                ></p>
                <h3
                    style="
                        text-align: center;
                        font-weight: 400;
                        font-size: 18px;
                    "
                >
                    We are processing your booking. Please confirm for a
                    booking from the restaurant
                </h3>
                <h4
                    style="
                        text-align: center;
                        font-weight: 400;
                        padding: 0 30px;
                    "
                >
                    (Please note, you should hear back within 3 hours,
                    if you still have receiver a confirmation please
                    contact our customer support team on 1235 2355 98)
                </h4>
            </td>
        </tr>
        <tr>
            <td style="text-align: center">
                <a
                href=${href}
                    style="
                        display: inline-block;
                        height: 40px;
                        line-height: 40px;
                        width: 170px;
                        background-color: blue;
                        border: none;
                        border-radius: 4px;
                        font-size: 16px;
                        color: #fff;
                        cursor: pointer;
                        margin-top: 37px;
                        text-transform: uppercase;
                        text-decoration: none;
                    "
                    >Confirm</a
                >
                
            </td>
        </tr>
    </tbody>
</table>`;
    return emailHTML;
};
exports.formEmail = formEmail;
