
interface FloatingButtonProps {
    handleAction: () => void;
    icon: React.ReactNode;
}

export const FloatingButton = ({ handleAction, icon }: FloatingButtonProps) => {
    return (
        <button
            type="button"
            aria-label="Save"
            onClick={handleAction}
            className="fixed bottom-8 right-8 z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-colors focus:outline-none cursor-pointer shadow-lg"
        >
            {icon}
        </button>
    );
};