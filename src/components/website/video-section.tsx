"use client";

import { useGetVideoLinkQuery } from "@/services/videoLinkApi";
import { motion } from "framer-motion";

export function VideoSection() {
    const { data, isLoading, isError } = useGetVideoLinkQuery();

    if (isLoading || isError || !data?.data || data.data.status !== "active") {
        return null;
    }

    const { title, description, video } = data.data;

    let youtubeId = null;
    if (video) {
        const youtubeMatch = video.match(
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        );
        youtubeId =
            youtubeMatch && youtubeMatch[2].length === 11 ? youtubeMatch[2] : null;
    }

    return (
        <section className="py-6 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    {title && (
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
                            {title}
                        </h2>
                    )}
                    {description && (
                        <div className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
                            {description.split("\n").map((line, i) => (
                                <span key={i}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </div>
                    )}
                </motion.div>

                {video && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full max-w-7xl mx-auto rounded-xl md:rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video flex items-center justify-center relative"
                    >
                        {youtubeId ? (
                            <iframe
                                className="w-full h-full absolute inset-0"
                                src={`https://www.youtube.com/embed/${youtubeId}`}
                                title={title || "Video Preview"}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <video
                                controls
                                className="w-full h-full object-contain absolute inset-0"
                                src={video}
                            >
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
