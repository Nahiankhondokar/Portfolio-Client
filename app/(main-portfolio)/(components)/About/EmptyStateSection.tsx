import {Info} from "lucide-react";


const EmptyStateSection = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-[#333] rounded-xl opacity-50">
        <Info size={24} className="mb-2 text-yellow-500" />
        <p className="text-sm uppercase tracking-widest">{message}</p>
    </div>
);

export default EmptyStateSection;