"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormEmailForgotPassword = void 0;
const FormEmailForgotPassword = ({ href, name, }) => {
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
                <h2 style="font-weight: 300; color: #5b7e9d">
                    Hello ${name},
                </h2>
                <h3 style="color: #36526b">
                    A request has been received to change the password
                    for your PizzaRestaurant account
                </h3>
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
                        padding: 0 20px;
                        background: #1a82e2 !important;
                        border: 1px solid #1a82e2 !important;
                        border: none;
                        border-radius: 4px;
                        font-size: 16px;
                        color: #fff;
                        cursor: pointer;
                        margin: 30px 0px;
                        text-transform: uppercase;
                        text-decoration: none;
                    "
                    >Reset Password</a
                >
            </td>
        </tr>
        <td>
            <h4 style="font-weight: 300">
                If you did not initiate this request, please contact us
                immediately at
                <a
                    href="#"
                    style="font-weight: 300"
                    >support@pizzarestaurant.com</a
                >
            </h4>

            <h4 style="font-weight: 300; margin: 10px 0px">
                Thank you,
            </h4>
            <h4
                style="
                    text-transform: capitalize;
                    font-weight: 300;
                    margin: 10px 0px;
                "
            >
                The PizzaRestaurant Team
            </h4>
        </td>
    </tbody>
</table>`;
    return emailHTML;
};
exports.FormEmailForgotPassword = FormEmailForgotPassword;
