import Link from "next/link";
import { FC } from "react";
import { FaArrowRight } from "react-icons/fa";
import { TbSquareRoundedArrowRight } from "react-icons/tb";

interface ArrowCardProps {
  title: string;
  caption: string;
  href: string;
}

const ArrowCard: FC<ArrowCardProps> = ({ title, caption, href }) => {
  return (
    <Link href={href} passHref>
      <div className="block p-4 transition-transform transform bg-white shadow-lg rounded-lg ">
        <div className="flex justify-between items-center">
          <div className="flex flex-col max-w-xl">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">{caption}</p>
          </div>
          <TbSquareRoundedArrowRight className="w-8 h-8 text-primary" />
        </div>
      </div>
    </Link>
  );
};

export default ArrowCard;
