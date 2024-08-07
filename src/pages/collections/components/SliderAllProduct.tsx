import React, { useState } from "react";
import styles from "../../../style/index.module.scss";
import { productProps } from "../../../app/actions/apiProductSlice";
import Slider from "react-slick";
import { ImageArray } from "../../../components/ImageArray";
import { convertObjectToArray, faWishlist, formattedNumber } from "../../../utils/convert";
import { useAppSelector } from "../../../app/hooks";
import { useGetApiCart } from "../../../hook";
import { SlBasket } from "../../../utils/icons";
import { ButtonWishlist } from "./index";

type SliderAllProductProps = {
    products: productProps[] | []
}

export const SliderAllProduct = ({ products }: SliderAllProductProps) => {
    // Redux
    const { dataWishlist } = useAppSelector(state => state.apiWishlist);
    // Custome Hook
    const { handleAddCart } = useGetApiCart(); // Get Api's Cart
    // State
    const [activeSlide, setActiveSlide] = useState(0);
    let slidesPerRows = 4;
    let rows = 6;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        rows: rows,
        slidesPerRow: slidesPerRows,
        responsive: [
            {
                breakpoint: 1180,
                settings: {
                    rows: rows,
                    slidesPerRow: 3,
                }
            },
            {
                breakpoint: 1000,
                settings: {
                    rows: rows,
                    slidesPerRow: 2,
                }
            }
        ],
        // Mengambil data next slider
        beforeChange: (current: number, next: number) => {
            const slide = next;
            setActiveSlide(slide);
        },

        // custome background paging / dot.
        appendDots: (dots: React.ReactNode) => {
            const totalSlides = products.length / slidesPerRows / rows;
            let start = activeSlide - 1;
            let end = activeSlide + 2;

            if (start < 0 || totalSlides < 3) {
                start = 0;
                end = 3;
            } else if (activeSlide >= totalSlides - 2) {
                start = Math.ceil(totalSlides) - 3;
                end = Math.ceil(totalSlides);
            }

            // custome display paging
            const displayDots = (dots as any[]).slice(start, end);

            return (
                <div>
                    <ul style={{ margin: "-10px" }}> {displayDots} </ul>
                </div>
            );
        },

        // Custome Paging
        customPaging: (i: number) => (
            <div
                className={`
                    ${activeSlide === i && styles["active-paging"]}
                `}
            >
                {i + 1}
            </div>
        )
    };

    return (
        <>
            {products.length !== 0 && (
                <div className={styles["container-slider-all-product"]}>
                    <Slider {...settings} className={styles["custom-slider"]}>
                        {products.map((slide, index) => (
                            <div key={slide.id} className={styles["global-card-padding"]}>
                                <div className={`${styles["global-card-product"]} card`}>
                                    <div className={`${styles["card-top"]}`}>
                                        <ImageArray indexs={index} imageUrl={convertObjectToArray(slide.url)} nameProducts={slide.name} />
                                    </div>
                                    <div className={styles["card-bottom"]}>
                                        <h3>{slide.name}</h3>
                                        <p>rp {formattedNumber(slide.price)}</p>
                                        <div className={styles["parent-button"]}>
                                            <ButtonWishlist
                                                dataWishlist={faWishlist(slide, dataWishlist)}
                                                idProduct={slide.id}
                                            />

                                            <button
                                                type="button"
                                                aria-label="basket"
                                                className={styles["icon-basket"]}
                                                onClick={() => {
                                                    handleAddCart(slide, 1)
                                                }}
                                            >
                                                <SlBasket />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            )}
        </>
    )
}
