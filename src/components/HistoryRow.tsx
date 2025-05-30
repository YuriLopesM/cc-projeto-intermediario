import { Schedule } from "@/types";
import dayjs from "dayjs";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

type HistoryRowProps = {
  doctorName: string;
  scheduleDate: Date | string;
  status: Schedule["status"];
};

export function HistoryRow({
  doctorName,
  scheduleDate,
  status,
}: HistoryRowProps) {
  return (
    <div className="bg-gray-400 p-4 rounded font-bold text-xl flex text-white w-full justify-between">
      <div>
        {doctorName} - {dayjs(scheduleDate).format("DD/MM/YYYY HH:mm")} -{" "}
        {status}
      </div>
      <div className="">
        {status === "Confirmado" && (
          <FaCheckCircle className="w-[25px] h-[25px]" color="white" />
        )}
        {status === "Aguardando aprovação" && (
          <FaClock className="w-[25px] h-[25px]" color="white" />
        )}
        {status === "Cancelado" && (
          <FaTimesCircle className="w-[25px] h-[25px]" color="white" />
        )}
      </div>
    </div>
  );
}
