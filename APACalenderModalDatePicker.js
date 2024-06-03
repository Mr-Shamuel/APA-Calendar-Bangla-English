import JoditEditor from "jodit-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import th_bn from "../../Common/CommonDate/th_bn";
import DatePicker from "react-multi-date-picker";
import axiosInstance from "../../Services/Interceptor";
import { useDispatch, useSelector } from "react-redux";
import {toast, Slide} from "react-toastify";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { getHierarchyData } from "../../Redux/Actions/Configuration/HierarchyAction";
import { getAPACalenderData } from "../../Redux/Actions/APACalender/APACalenderAction";
import { getNoticeTypeData } from "../../Redux/Actions/Configuration/NoticeTypeAction";
import { getAPACalenderTableData } from "../../Redux/Actions/APACalender/APACalenderTableAction";

const APACalenderModal = ({
  setShowModal,
  showModal,
  control,
  btnState,
  updateAPACalenderData,
  setUpdateAPACalenderData,
  // selectedInfo,
  register,
  handleSubmit,
  reset,
  errors,
  setValue
}) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { hierarchy } = useSelector((state) => state?.hierarchy);
  const { noticeType } = useSelector((state) => state?.noticeType);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);

  const config = {
    placeholder: t("CommonBtn.placeholder2"),
  };
  console.log(updateAPACalenderData, 'myyyyyyyyy')
  const defaultTime = "12:00";

  useEffect(() => {
    dispatch(getNoticeTypeData());
    dispatch(getHierarchyData());
  }, [dispatch]);

  useEffect(() => {
    setStartDate(updateAPACalenderData?.startDate);
    setEndDate(updateAPACalenderData?.endDate);
    reset(updateAPACalenderData);
  }, [updateAPACalenderData]);

  // useEffect(() => {
  //   reset(selectedInfo);
  // }, [selectedInfo]);

  const handleCloseModal = () => {
    setUpdateAPACalenderData({});
    // setValue('startTime',null)
    // setValue('endTime',null)
    setShowModal(false);
    reset();
  };

  const onDateChangeStart = (date) => {
    const year = date.year;
    const month =
      date.month.number >= 10 ? date.month.number : `0${date.month.number}`;
    const day = date.day >= 10 ? date.day : `0${date.day}`;
    const startDates = `${year}-${month}-${day}`;
    setStartDate(startDates);
  };

  const onDateChangeEnd = (date) => {
    const year = date.year;
    const month =
      date.month.number >= 10 ? date.month.number : `0${date.month.number}`;
    const day = date.day >= 10 ? date.day : `0${date.day}`;
    const endDates = `${year}-${month}-${day}`;
    setEndDate(endDates);
  };
  // For Submit button function
  const onSubmit = (data) => {
    data.startDate = startDate;
    data.endDate = endDate;

    let datas = {
      hierarchyId: data?.hierarchyId,
      titleBn: data?.title,
      titleEn: data?.title,
      description: data?.description,
      noticeTypeId: data?.noticeTypeId,
      endDate: data?.endDate,
      startDate: data?.startDate,
      endTime: data?.endTime ? data?.endTime : defaultTime,
      startTime: data?.startTime ? data?.startTime : defaultTime,
    };

    if (btnState === "update") {
      axiosInstance
        .put(
          `/miscellaneous-service/api/v1/apa-calendar/${updateAPACalenderData.id}`,
          datas
        )
        .then((res) => {
        
          if (res?.status === 200) {
            dispatch(getAPACalenderTableData());
            setUpdateAPACalenderData({});
            setShowModal(false);
            toast.success(t("CommonToast.update"), {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: false,
              transition: Slide,
              autoClose: 1000,
              theme: "colored",
            });
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else {
      //create
      axiosInstance
        .post("/miscellaneous-service/api/v1/apa-calendar/create", datas)
        .then((res) => {
          dispatch(getAPACalenderData());
          setShowModal(false);
          toast.success(t("CommonToast.save"), {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            transition: Slide,
            autoClose: 1000,
            theme: "colored",
          });
          setTimeout(() => {
            window.location.reload();
          }, 1010);
        })
        .catch((err) => {
          console.log(err.response.data.message, "err");
          toast.error(err.response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            transition: Slide,
            autoClose: 1000,
            theme: "colored",
          });
        });
    }
  };

  return (
    <Modal
      size="md"
      show={showModal}
      centered
      aria-labelledby="example-modal-sizes-title-sm"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {t("APACalendar.header")}{" "}
          </Modal.Title>
          <Button
            variant="none"
            className="btn btn-danger ms-auto btn-sm"
            onClick={handleCloseModal}
          >
            <i className="fas fa-times"></i>
          </Button>
        </Modal.Header>

        <Modal.Body>
          {/* Titel*/}
          <Row className="row-xs align-items-center mg-b-5">
            <Col md={12} sm={12} className=" mg-t-5 mg-md-t-0">
              <Form.Label className="form-label mg-b-5 text-dark">
                {t("APACalendar.title")} <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="input"
                placeholder={t("APACalendar.title_Placeholder")}
                style={{ height: "40px" }}
                type="text"
                defaultValue={updateAPACalenderData?.titleEn}
                {...register("title", {
                  required: true,
                })}
              />

              {errors?.title?.type === "required" && (
                <span className="text-danger" style={{ fontSize: "16px" }}>
                  {i18n.language === "en"
                    ? " Title Required"
                    : "এই তথ্যটি আবশ্যক"}
                </span>
              )}
            </Col>
          </Row>

          <Row className="row-xs align-items-center mg-b-5">
            <Col md={6} sm={12} className=" mg-t-5 mg-md-t-0">
              <Form.Label className="form-label mg-b-5 text-dark">
                {t("APACalendar.hierarchy")}{" "}
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                {...register("hierarchyId", {
                  required: true,
                })}
                style={{ height: "40px" }}
              >
                <option
                  value={
                    updateAPACalenderData?.hierarchy?.id
                      ? updateAPACalenderData?.hierarchy?.id
                      : ""
                  }
                  selected
                >
                  {updateAPACalenderData?.hierarchy?.id
                    ? hierarchy?.map(
                        (item, index) =>
                          item?.id === updateAPACalenderData?.hierarchy?.id && (
                            <option key={index} value={item?.id}>
                              {i18n.language === "en" ? item?.nameEn : item?.nameBn}
                            </option>
                          )
                      )
                    : t("CommonBtn.placeholder")}
                </option>
                {hierarchy?.map((item, index) => (
                  <option key={index} value={item?.id}>
                    {i18n.language === "en" ? item?.nameEn : item?.nameBn}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6} sm={12} className=" mg-t-5 mg-md-t-0">
              <Form.Label className="form-label mg-b-5 text-dark">
                {t("APACalendar.eventType")}{" "}
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                {...register("noticeTypeId", {
                  required: true,
                })}
                style={{ height: "40px" }}
              >
                <option
                  value={
                    updateAPACalenderData?.noticeType?.id
                      ? updateAPACalenderData?.noticeType?.id
                      : ""
                  }
                  selected
                >
                  {updateAPACalenderData?.noticeType?.id
                    ? noticeType.content?.map(
                        (item, index) =>
                          item?.id ===
                            updateAPACalenderData?.noticeType?.id && (
                            <option key={index} value={item?.id}>
                             
                            {i18n.language === "en" ? item?.nameEn : item?.nameBn}
                            </option>
                          )
                      )
                    : t("CommonBtn.placeholder")}
                </option>
                {noticeType?.content?.map((item, index) => (
                  <option key={index} value={item?.id}>
                    {i18n.language === "en" ? item?.nameEn : item?.nameBn}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {/* startDate*/}
          <Row className="row-xs align-items-center mg-b-5">
            <Col md={6} sm={12} className=" mg-t-5 mg-md-t-0">
              <Form.Label className="form-label mg-b-5 text-dark">
                {t("APACalendar.startDate")}{" "}
                <span className="text-danger">*</span>
              </Form.Label>
              <Controller
                control={control}
                name="startDate"
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker
                    // onlyYearPicker // only year
                    // value={field.value || new Date(selectedInfo?.startStr)}
                    value={field.value }
                    onChange={(date) => {
                      field.onChange(date);
                      onDateChangeStart(date);
                    }}
                    locale={i18n.language === "en" ? undefined : th_bn}
                    dateFormat="yyyy-MM-dd"
                    style={{ height: "42px", width: "100%" }}
                    placeholder={
                      i18n.language === "en" ? "YYYY-MM-DD" : "বছর/মাস/দিন"
                    }
                  />
                )}
              />

              <div>
                {errors?.startDate?.type === "required" && (
                  <span className="text-danger " style={{ fontSize: "16px" }}>
                    {i18n.language === "en"
                      ? " Year Required"
                      : "এই তথ্যটি আবশ্যক"}
                  </span>
                )}
              </div>
            </Col>

            <Col md={6} sm={12} className=" mg-t-5 mg-md-t-0">
              <Form.Label className="form-label mg-b-5 text-dark">
                {t("APACalendar.endDate")}{" "}
                <span className="text-danger">*</span>
              </Form.Label>
              <Controller
                control={control}
                name="endDate"
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker
                    // onlyYearPicker // only year
                    // value={field.value || new Date(selectedInfo?.endStr)}
                    value={field.value }
                    onChange={(date) => {
                      field.onChange(date);
                      onDateChangeEnd(date);
                    }}
                    locale={i18n.language === "en" ? undefined : th_bn}
                    dateFormat="yyyy-MM-dd"
                    style={{ height: "42px", width: "100%" }}
                    placeholder={
                      i18n.language === "en" ? "YYYY-MM-DD" : "বছর/মাস/দিন"
                    }
                  />
                )}
              />

              <div>
                {errors?.endDate?.type === "required" && (
                  <span className="text-danger " style={{ fontSize: "16px" }}>
                    {i18n.language === "en"
                      ? " Year Required"
                      : "এই তথ্যটি আবশ্যক"}
                  </span>
                )}
              </div>
            </Col>
          </Row>

          {/*startTime and end Time*/}
          <Row className="row-xs align-items-center mg-b-10">
            <Col md={6} sm={12} className=" mg-t-5 mg-md-t-0">
              <Form.Label className="form-label mg-b-5 text-dark">
                {t("APACalendar.startTime")}{" "}
              </Form.Label>
              <Form.Control
                as="input"
                style={{ height: "40px" }}
                type="time"
                // name="startTime"
                defaultValue={updateAPACalenderData?.startTime}
                {...register("startTime")}
              />
            </Col>
            <Col md={6} sm={12} className=" mg-t-5 mg-md-t-0">
              <Form.Label className="form-label mg-b-5 text-dark">
                {t("APACalendar.endTime")}{" "}
              </Form.Label>
              <Form.Control
                as="input"
                style={{ height: "40px" }}
                type="time"
                // name="endTime"
                defaultValue={updateAPACalenderData?.endTime}
                {...register("endTime")}
              />
            </Col>
          </Row>

          {/* Status field */}
          <Row className="row-xs align-items-center mg-b-5">
            <Col md={4}>
              <Form.Label className="form-label mg-b-5 text-dark">
                {t("APACalendar.status")} <span className="text-danger">*</span>
              </Form.Label>
            </Col>
            <Col md={8} className="mg-t-5 mg-md-t-0">
              <Form.Check
                inline
                label={t("APACalendar.status1")}
                {...register("statusId", { required: true })}
                type="radio"
                value={1}
                checked={true}
              />
              <Form.Check
                inline
                label={t("APACalendar.status2")}
                {...register("statusId", { required: true })}
                type="radio"
                value={2}
              />

              {errors?.statusId?.type === "required" && (
                <span className="text-danger" style={{ fontSize: "16px" }}>
                  <br />{" "}
                  {i18n.language === "en" ? " Required" : "এই তথ্যটি আবশ্যক"}
                </span>
              )}
            </Col>
          </Row>

          {/* Description*/}
          <Form.Label className="form-label text-dark  mb-3 mt-0  fw-bolder">
            {t("APACalendar.desc")}
          </Form.Label>
          <Controller
            name="description"
            control={control}
            // rules={{ required: "This field is required." }}
            render={({ field }) => (
              <JoditEditor
                value={updateAPACalenderData?.description}
                config={config}
                onChange={(newValue) => field.onChange(newValue)}
              />
            )}
          />
          {errors?.description?.type === "required" && (
            <span className="text-danger" style={{ fontSize: "16px" }}>
              {i18n.language === "en" ? " Required" : "এই তথ্যটি আবশ্যক"}
            </span>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant=""
            className="btn btn-secondary btn-sm mg-r-5 pd-x-30 mg-t-5"
            onClick={handleCloseModal}
          >
            {t("CommonBtn.close")}
          </Button>
          {btnState === "add" ? (
            <Button
              variant=""
              type="submit"
              className="btn btn-primary btn-sm pd-x-30 mg-r-5 mg-t-5"
            >
              {t("CommonBtn.create")}
            </Button>
          ) : (
            <Button
              variant=""
              type="submit"
              className="btn btn-primary btn-sm pd-x-30 mg-r-5 mg-t-5"
            >
              {t("CommonBtn.update")}
            </Button>
          )}
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default APACalenderModal;
