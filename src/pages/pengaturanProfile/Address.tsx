import { useCallback, useEffect, useState } from "react";
import styles from "../../style/index.module.scss";
import { MenuPengaturanProfile } from "../../features/pengaturanProfile/MenuPengaturanProfile";
import { ProfileEmailAndLink } from "../../features/pengaturanProfile/ProfileEmailAndLink";
import { NavigationBar } from "../../features/navbar/NavigationBar";
import { FormAddress } from "../../features/pengaturanProfile/FormAddress";
import { useBodyScrollLock } from "../../hook/useBodyScrollLock";
import { DisplayAddress } from "../../features/pengaturanProfile/DisplayAddress";
import { ImCheckboxChecked, MdSelectAll, MdDeselect, IoIosCloseCircle, BsTrashFill } from "../../utils/icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { handleOnCheckboxAddress, removeAddress, resetCheckeds } from "../../app/actions/apiAddressSlice";
import { ButtonTooltip } from "../../components/ButtonTooltip";
import { useGetApiAddress } from "../../hook/useGetApiAddress";
import addressEmpty from "../../assets/address/addressEmpty.svg";

export const Address = () => {
    // State
    const [active, setActive] = useState({ formAddress: false, checkbox: false });
    const [buttonIcon, setButtonIcon] = useState({ selectAll: "disabled-button-icon" })
    const [addressLength, setAddressLength] = useState<any>([]);
    // Custome Hook
    const { toggle } = useBodyScrollLock();
    const { callGetApiAddress } = useGetApiAddress();
    // useAppSelector
    const { dataAddress, checkeds, isMessage } = useAppSelector(state => state.apiAddress);
    // useDispatch
    const dispatch = useAppDispatch();

    const changeActive = (event: any) => {
        setActive(prev => {
            return { ...prev, ...event }
        })
    }

    const changeButtonIcon = (event: any) => {
        setButtonIcon(prev => {
            return { ...prev, ...event }
        })
    }

    const handleOnCloseForm = (event: any) => {
        toggle(true);
        changeActive(event);
    }

    const handleRemoveAddress = () => {
        if (checkeds.length !== 0) {
            const uuid = localStorage.getItem("uuid");
            const link = `${process.env.REACT_APP_API_URL_LOCAL}/address/${uuid}`
            const id = checkeds.map(item => item.id);
            const data = { id: [...id] }
            dispatch(removeAddress({ data, link }))
        }
    }

    const handleCallGetAddress = useCallback(() => {
        if (isMessage === "delete address success") return callGetApiAddress()
    }, [isMessage, callGetApiAddress])

    const handleClassButtonIcon = useCallback(() => {
        if (dataAddress.length === 0) {
            changeButtonIcon({ selectAll: "disabled-button-icon" });
        } else {
            changeButtonIcon({ selectAll: "button-icon" });
        }
    }, [dataAddress.length])

    useEffect(() => {
        if (active.checkbox === false) {
            dispatch(resetCheckeds())
        }
        if (dataAddress !== null) setAddressLength(dataAddress.length);
        if (dataAddress.length === 0) changeActive({ checkbox: false });
        handleCallGetAddress();
        handleClassButtonIcon();
    }, [active.checkbox, dispatch, dataAddress, handleCallGetAddress, handleClassButtonIcon])

    return (
        <>
            {/* Navbar */}
            {/* < NavigationBar /> */}
            {/* Form Address */}
            {active.formAddress === true && (
                <FormAddress onClicks={() => handleOnCloseForm({ formAddress: false })} />
            )}

            <div className={`${styles["global-container"]}`}>
                <div className={`${styles["global-parent-pengaturan-profile"]}`}>
                    <ProfileEmailAndLink />
                    <div className={`${styles["global-flex"]}`}>
                        {/* NavLink menu users profile */}
                        <MenuPengaturanProfile />

                        {/* Form update email */}
                        <div className={styles["container-address"]}>
                            <div className={styles["parent-judul-address"]}>
                                <div className={styles["parent-select-header"]}>
                                    {active.checkbox && (
                                        <>
                                            <div className={styles["parent-btnclose-quantity"]}>
                                                <ButtonTooltip
                                                    styleButton="button-icon-close"
                                                    onClicks={() => changeActive({ checkbox: false })}
                                                    textTooltip="Close Select All"
                                                    styleTooltip="tooltip"
                                                    positionX={35}
                                                    positionY={50}
                                                >
                                                    <IoIosCloseCircle />
                                                </ButtonTooltip>
                                                <span className={styles["quantity-checkbox"]}>{checkeds.length}</span>
                                            </div>
                                            {/* Line */}
                                            <hr />
                                        </>
                                    )}
                                    <h2>My address</h2>
                                </div>

                                <div className={styles["container-button"]}>
                                    {!active.checkbox ? (
                                        <div className={styles["parent-btn-checkbox-address"]}>
                                            {/* Button Icon */}
                                            <ButtonTooltip
                                                styleButton={buttonIcon.selectAll}
                                                onClicks={() => {
                                                    if (dataAddress.length !== 0) return changeActive({ checkbox: true })
                                                }}
                                                textTooltip="Select All"
                                                styleTooltip="tooltip"
                                                positionX={15}
                                                positionY={50}
                                            >
                                                <ImCheckboxChecked />
                                            </ButtonTooltip>
                                            {/* Line */}
                                            <hr />
                                            {/* Button */}
                                            <div className={styles["parent-button"]}>
                                                <button

                                                    onClick={() => handleOnCloseForm({ formAddress: true })}
                                                >
                                                    Add Address
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={styles["parent-btn-selectall-remove"]}>
                                            {addressLength !== checkeds.length ? (
                                                <ButtonTooltip
                                                    styleButton="button-icon"
                                                    onClicks={() => dispatch(handleOnCheckboxAddress({ selectAll: true }))}
                                                    textTooltip="Select All Checkbox"
                                                    styleTooltip="tooltip"
                                                    positionX={50}
                                                    positionY={50}
                                                >
                                                    <MdSelectAll />
                                                </ButtonTooltip>
                                            ) : (
                                                <ButtonTooltip
                                                    styleButton="button-icon"
                                                    onClicks={() => dispatch(handleOnCheckboxAddress({ selectAll: true }))}
                                                    textTooltip="Disabled Select All"
                                                    styleTooltip="tooltip"
                                                    positionX={45}
                                                    positionY={50}
                                                >
                                                    <MdDeselect />
                                                </ButtonTooltip>
                                            )}
                                            {/* Line */}
                                            <hr />
                                            <ButtonTooltip
                                                styleButton="button-icon"
                                                onClicks={() => handleRemoveAddress()}
                                                textTooltip="Remove Address"
                                                styleTooltip="tooltip"
                                                positionX={45}
                                                positionY={50}
                                            >
                                                <BsTrashFill />
                                            </ButtonTooltip>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {addressLength === 0 && (
                                <div className={styles["parent-address-empty"]}>
                                    <img src={addressEmpty} alt="Img Address Empty" />
                                    <p>Address Empty</p>
                                </div>
                            )}
                            <DisplayAddress activeCheckbox={active.checkbox} />
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
