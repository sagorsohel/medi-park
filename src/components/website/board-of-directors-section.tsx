import { cn } from "@/lib/utils"
// import { directors } from "@/data/directors-data"
import { Link } from "react-router"
import { useGetDirectorsQuery, type Director } from "@/services/directorApi"

export function BoardOfDirectorsSection() {
    const { data: directorsData, isLoading } = useGetDirectorsQuery({ limit: 100 });
    const directors = directorsData?.data || [];

    if (isLoading) {
        return (
            <section className="py-16 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 aspect-[4/5] w-full"></div>
                                <div className="h-16 bg-gray-100 mt-2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-background">
            <div className=" max-w-7xl mx-auto px-4 sm:px-0">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-[#1e3a8a] uppercase relative inline-block">
                        BOARD OF DIRECTORS
                        <span className="absolute bottom-[-8px] left-0 w-16 h-1 bg-[#10b981]"></span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {directors.map((director: Director) => (
                        <Link key={director.id} to={`/about/board-of-directors/${director.id}`} className="block">
                            <div className="flex flex-col group cursor-pointer">
                                <div className="border-[3px] border-[#10b981] p-1 bg-white transition-transform duration-300 group-hover:scale-[1.02]">
                                    <div className="bg-[#f0fdf4] aspect-[4/5] overflow-hidden relative flex items-end justify-center">
                                        <img
                                            src={director.photo || "/placeholder-person.jpg"}
                                            alt={director.name}
                                            className="w-full h-full object-cover object-top"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/placeholder-person.jpg";
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="bg-[#10b981] text-white text-center py-3 mt-0 transition-colors duration-300 group-hover:bg-[#059669]">
                                    <h3 className="font-bold text-sm md:text-base uppercase leading-tight px-2">
                                        {director.name}
                                    </h3>
                                    <p className="text-xs md:text-sm italic mt-0.5 opacity-90">
                                        {director.designation}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
