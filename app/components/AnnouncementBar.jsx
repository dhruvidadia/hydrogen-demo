import { useEffect, useRef, useState } from "react";

const AnnouncementBar = () => {
    const [countDays, setCountDays] = useState(0);
    const [countHours, setCountHours] = useState(0);
    const [countMinutes, setCountMinutes] = useState(0);
    const [countSeconds, setCountSeconds] = useState(0);
    const refAnnouncementtext = useRef(null);

    useEffect(() => {
        setInterval(() => {
            const countDownDate = new Date("2023-10-23T00:00:00Z").getTime();
            const CountNow = new Date().getTime();
            const countTimeToDate = countDownDate - CountNow;
            setCountDays(Math.floor(countTimeToDate / (1000 * 60 * 60 * 24)));
            setCountHours(Math.floor((countTimeToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
            setCountMinutes(Math.floor((countTimeToDate % (1000 * 60 * 60)) / (1000 * 60)));
            setCountSeconds(Math.floor((countTimeToDate % (1000 * 60)) / 1000));
        }, 1000);
    },[])

    return (
        <div className="bg-slate-900 flex w-full px-4 py-4 text-center justify-center" id="scroll-container">
            <div className="text-white block" ref={refAnnouncementtext}>
                <p>🚚 Free Shipping on Orders Over <strong>$100</strong>! Shop Now! #CelebrateWithSavings</p>
            </div>
            {/* <div className="flex w-1/2 justify-end gap-2">
                <div className="text-white">
                    <span className="block text-center">{countDays}</span>
                    <span className="block">Days</span>
                </div>
                <div className="text-white">
                    <span className="block text-center">{countHours}</span>
                    <span className="block">Hours</span>
                </div>
                <div className="text-white">
                    <span className="block text-center">{countMinutes}</span>
                    <span className="block">Minutes</span>
                </div>
                <div className="text-white">
                    <span className="block text-center">{countSeconds}</span>
                    <span className="block">Seconds</span>
                </div>
            </div> */}
        </div>
    )
}

export default AnnouncementBar;