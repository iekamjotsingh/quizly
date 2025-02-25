export const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="text-center p-8">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 border-4 border-[#FF6B35]/20 border-t-[#FF6B35] rounded-full mx-auto mb-4"
    />
    <p className="text-xl text-gray-700 font-medium">{message}</p>
  </div>
); 