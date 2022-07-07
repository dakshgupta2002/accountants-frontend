

const resetResult = () => {
    document.getElementById('result').innerHTML = `
    <tr>
        <th>Year</th>
        <th>Principle Amount</th>
        <th>Interest Amount</th>
        <th>Penal Amount</th>
    </tr>
    `;
}

const addResult = (displayDate, numOfDays, principleAmount, interestAmount, penalAmount, className) => {
    if (className === 'paymentClass') {
        document.getElementById('result').innerHTML += ` 
            <h1>
                Payment was made!
            </h1>
        `
    }
    let entry = `
    <tr class=${className}>
        <td>${displayDate.toLocaleDateString('en-GB')}, ${Math.round(numOfDays)}</td>
        <td>${seperator(Math.round((principleAmount + Number.EPSILON) * 100) / 100)}</td>
        <td>${seperator(Math.round((interestAmount + Number.EPSILON) * 100) / 100)}</td>
        <td>${seperator(Math.round((penalAmount + Number.EPSILON) * 100) / 100)}</td>
    </tr>
`
    document.getElementById('result').innerHTML += entry;
}


document.getElementById('submit').addEventListener('click', () => {

    //calculate the installments and payments net 
    principleAmount = (amountPrice) * (1 - downPayment / 100);
    installmentAmount = principleAmount / installmentNumber;

    let beginDate = new Date(allotmentDate); //date from which interest begins
    let currentDate = new Date(allotmentDate); //date upto which due is calculated
    let today = new Date().getTime();
    let displayDate;
    let currentPaymentNum = 0;

    for (let i = 0; i < 100; i++) {

        //increment currentDate by 6 or 12 months (installment)
        beginDate = new Date(currentDate);
        if (installmentNumber > 0) { //add time by 6 mons
            //console.log("Pay installment number", installmentNumber)
            currentDate.setMonth(currentDate.getMonth() + 6);
            installmentNumber -= 1;
        } else { //add 12 months
            //console.log("Yearly compound interest beginning")
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            currentDate.setDate(1);
        }

        //console.log("Interest from", beginDate.toLocaleDateString(), "to", currentDate.toLocaleDateString());
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (currentDate.getTime() > today) {
            //console.log("Time limit reached to today")
            currentDate = new Date(new Date(today).toLocaleDateString());
            i = 100; // only find interest till today 
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (paymentHistory.length - 1 < currentPaymentNum) {
            //console.log("No payment will be made, calculating interest")
            // payment was not made, so calculate interest and add to principle
            const numOfDays = (currentDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60 * 24);
            interestAmount = principleAmount * (rateInterest / 100) * numOfDays / 365;
            penalAmount = principleAmount * (penalInterest / 100) * numOfDays / 365;

            //append these values to result 
            addResult(currentDate, numOfDays, principleAmount, interestAmount, penalAmount, null);
            principleAmount += interestAmount + penalAmount;
        } else {
            //else add interest but first check if payment was made
            const paymentDate = new Date(paymentHistory[currentPaymentNum][0]);

            if (paymentDate.getTime() <= currentDate.getTime()) {
                //console.log("Payment was made before or on time")
                let numOfDays = (paymentDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60 * 24);

                if (installmentNumber >= 0) penalAmount = 0;
                else penalAmount = principleAmount * (penalInterest / 100) * numOfDays / 365;

                interestAmount = principleAmount * (rateInterest / 100) * numOfDays / 365;

                addResult(paymentDate, numOfDays, principleAmount, interestAmount, penalAmount, null);

                //adjust the payment made in the principle and interest
                let thisPaymentAmount = paymentHistory[currentPaymentNum][1];
                // console.log(installmentNumber, interestAmount, penalAmount, principleAmount)
                if (thisPaymentAmount >= penalAmount) {
                    thisPaymentAmount -= penalAmount;
                    penalAmount = 0;
                } else {
                    penalAmount -= thisPaymentAmount;
                    thisPaymentAmount = 0;
                }

                if (thisPaymentAmount >= interestAmount) {
                    thisPaymentAmount -= interestAmount;
                    interestAmount = 0;
                } else {
                    interestAmount -= thisPaymentAmount;
                    thisPaymentAmount = 0;
                }
                principleAmount += penalAmount + interestAmount - thisPaymentAmount;
                currentPaymentNum += 1;
                addResult(paymentDate, numOfDays, principleAmount, interestAmount, penalAmount, 'paymentClass');

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // interest from payment date to current date
                numOfDays = (currentDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24);
                if (installmentNumber >= 0) penalAmount = 0;
                else penalAmount = principleAmount * (penalInterest / 100) * numOfDays / 365;

                interestAmount = principleAmount * (rateInterest / 100) * numOfDays / 365;
                addResult(currentDate, numOfDays, principleAmount, interestAmount, penalAmount, null);

                principleAmount += interestAmount + penalAmount;

            } else if (installmentNumber >= 0 && (paymentDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24) <= 10) { // within 10 days 
                //if made within 10 days, then no penalty and interest of 6 mos
                //console.log("Payment was made within the warning time")
                penalAmount = 0;
                const numOfDays = (currentDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60 * 24);
                interestAmount = principleAmount * (rateInterest / 100) * numOfDays / 365;
                addResult(currentDate, numOfDays, principleAmount, interestAmount, penalAmount, null);
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //adjust the payment made in the principle and interest
                let thisPaymentAmount = paymentHistory[currentPaymentNum][1];
                if (thisPaymentAmount >= interestAmount) {
                    thisPaymentAmount -= interestAmount;
                    interestAmount = 0;
                } else {
                    interestAmount -= thisPaymentAmount;
                }
                principleAmount += interestAmount - thisPaymentAmount;
                currentPaymentNum += 1;

                //append these values to result 
                addResult(paymentDate, numOfDays, principleAmount, interestAmount, penalAmount, 'paymentClass');
                principleAmount += interestAmount + penalAmount;

            } else {
                //console.log("No payment was made in this due date, calculating interest")
                // payment was not made, so calculate interest and add to principle
                const numOfDays = (currentDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60 * 24);
                //payment was not made on this date, add interest and move on
                interestAmount = principleAmount * (rateInterest / 100) * numOfDays / 365;
                penalAmount = principleAmount * (penalInterest / 100) * numOfDays / 365;

                //append these values to result 
                addResult(currentDate, numOfDays, principleAmount, interestAmount, penalAmount, null);
                principleAmount += interestAmount + penalAmount;
            }

        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (installmentNumber == 0) {
            installmentNumber -= 1;
        }

    }

    document.getElementById('result').innerHTML += `
        <h1>
            Net outstanding dues = ${seperator(Math.round((principleAmount + interestAmount + penalAmount + Number.EPSILON) * 100) / 100)}
        </h1>
    `
})
