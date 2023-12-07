import { Money } from "@shopify/hydrogen";
import { useEffect, useState } from "react";

const ShippingBar = ({totalAmount}) => {
    
    const minimumAmount = 100;
    const [amountAway, setAmountAway] = useState(minimumAmount);
    const totalSpendAmount = totalAmount;
    const [remainingPercent, setRemainingPercent] = useState(0);
    useEffect(() => {
        setAmountAway(Number(minimumAmount) - Number(totalSpendAmount.amount))
    },[totalSpendAmount])
 
    useEffect(() => {
        setRemainingPercent(Number(totalSpendAmount.amount) / minimumAmount * 100);
    },[amountAway])

    return (
        <div className="p-4 mb-8 border border-gray-300 dark:border-gray-700 px-4 py-4 text-center text-black">
            {minimumAmount > totalSpendAmount.amount ? (
            <>
            <p className="mb-4 text-xl font-semibold dark:text-gray-400">Free Standard Shipping</p>
            <p className="text-sm">You are <Money className="inline-block text-xs font-medium px-3 py-1 bg-[#0a56a5] text-white" data={{amount: amountAway > 0 ? amountAway.toString() : "0", currencyCode: totalAmount.currencyCode }} /> away from Free Express Shipping!</p>
            </>
            )  : ( 
                <>
                    <p> Free Express Shipping! 🎉 </p>
                </>
                 )  } 
        </div>

    )
}

export default ShippingBar;