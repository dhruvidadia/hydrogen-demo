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
            <div>
                <span>You're</span>
                <Money className="px-2" data={{amount: amountAway > 0 ? amountAway.toString() : "0", currencyCode: totalAmount.currencyCode }} />
                <span>away from Free Express Shipping</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark-bg-gray-700">
                    <div className="bg-[#0a56a5] h-2.5 rounded-full" style={{width: `${remainingPercent > 100 ? 100 : remainingPercent}%`}}></div> 
                </div>
            </div>
            </>
            )  : ( 
                <>
                    <p> Free Express Shipping! </p>
                </>
                 )  } 
        </div>

    )
}

export default ShippingBar;