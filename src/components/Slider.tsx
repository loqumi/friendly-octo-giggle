import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

interface SlideData {
    year: number;
    description: string;
}

interface SliderProps {
    sliderData: SlideData[];
    isMobileScreen: boolean;
}

export default function Slider({ sliderData, isMobileScreen }: SliderProps) {
    return (
        <div className="swiper-container">
            <div className="swiper__wrapper">
                <Swiper
                    modules={[Navigation, Pagination, FreeMode]}
                    slidesPerView={isMobileScreen ? 2 : 3}
                    freeMode={isMobileScreen ? {
                        enabled: true,
                        momentumRatio: 0.6,
                    } : false}
                    grabCursor={!isMobileScreen}
                    navigation={{
                        prevEl: '.swiper__button-prev',
                        nextEl: '.swiper__button-next',
                    }}
                    pagination={{
                        el: '.swiper__pagination',
                        clickable: true,
                    }}
                    className="swiper"
                >
                    {sliderData.map((item) => (
                        <SwiperSlide key={item.year}>
                            <div className="swiper-slide__title">{item.year}</div>
                            <div className="swiper-slide__description">
                                {item.description}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <button className="swiper__button-prev" aria-label="Previous slide"></button>
                <button className="swiper__button-next" aria-label="Next slide"></button>
            </div>
            <div className="swiper__pagination"></div>
        </div>
    );
}