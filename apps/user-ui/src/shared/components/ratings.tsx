import { FC } from "react";
import { Star, StarHalf } from "lucide-react";

type Props = {
    rating: number;
}

const Ratings : FC<Props> = ({ rating }) => {
  const stars = [];

  for(let i=1; i<=5; i++){
    if(i <= rating) {
        stars.push(<Star stroke="#FFFF00" fill="#FFFF00" key={`star-${i}`} />)
    }
    else if(i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<StarHalf stroke="#FFFF00" fill="#FFFF00" key={`star-${i}`} />)
    } 
    else {
        stars.push(<Star stroke="#FFFF00" key={`star-${i}`} />)
    }
  }

  return (
    <div className="flex gap-1">{stars}</div>
  )
}

export default Ratings