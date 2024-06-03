import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import APACalenderModal from "./APACalenderModal";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { getAPACalenderData } from "../../Redux/Actions/APACalender/APACalenderAction";
import { useDispatch, useSelector } from "react-redux";
import { Slide, toast } from "react-toastify";
import axiosInstance from "../../Services/Interceptor";
import APACalenderTableModal from "./APACalenderTableModal";
import { getAPACalenderTableData } from "../../Redux/Actions/APACalender/APACalenderTableAction";
import "./ApaCalendar.css";
import Breadcrumb from "../../Common/CommonBreadcrumb/Breadcrumb";
import NotFoundAnimation from "../../Common/LottieFiles/NotFoundAnimation";
import { useTranslation } from "react-i18next";
import bnLocale from '@fullcalendar/core/locales/bn';

export function APACalendar() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [updateAPACalenderData, setUpdateAPACalenderData] = useState({});
  const [btnState, setBtnState] = useState("add");
  // const [selectedInfo, setSelectedInfo] = useState({});

  const [apaCalenderData, setApaCalenderData] = useState([]);
  const { apaCalenderTable } = useSelector((state) => state.apaCalenderTable);

  useEffect(() => {
    dispatch(getAPACalenderTableData());
  }, [dispatch]);
 

  useEffect(() => {
    if (apaCalenderTable && apaCalenderTable?.length > 0) {
      const eventsData = apaCalenderTable?.map((item) => ({
        id: item?.id,
        title: item?.titleBn,
        // start: item?.startDate,
        // end: new Date(
        //   new Date(item?.endDate).setDate(new Date(item?.endDate).getDate() + 1)
        // )
        //   .toISOString()
        //   .substring(0, 10),

        start: `${item?.startDate}T${item.startTime}:00`, 
        end: `${item?.endDate}T${item.endTime}:00` ,

        

      }));
      setApaCalenderData(eventsData); 
    }
  }, [apaCalenderTable]);
  const handleEventClick = (clickInfo) => {
    Swal.fire({
      title: t("CommonToast.areYouSure"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("CommonBtn.yes"),
      cancelButtonText: t("CommonBtn.no"),
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(
            `/miscellaneous-service/api/v1/apa-calendar/${clickInfo.event._def.publicId}`
          )
          .then((res) => {
            dispatch(getAPACalenderData());
            toast.error(t("CommonToast.delete"), {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: false,
              transition: Slide,
              autoClose: 500,
              theme: "colored",
            });
            setTimeout(() => {
              window.location.reload();
            }, 510);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  // const handleDateSelect = (selectInfo) => {
  //   setSelectedInfo(selectInfo);
  //   setShowModal(true);
  // };

  const handleOpenModal = () => {
    setBtnState("add");
    setShowModal(true);
  };

  const handleOpenListViewModal = () => {
    setShowTableModal(true);
  };

  const toolkitData = {
    title: t("Breadcrumb.apa_Management.apaCalendars"),
    description: t("toolkitDescription.apaCalenderDesc"),
  };

  if (apaCalenderData?.length > 0) {
    return (
      <div className="main-container container">
        {/* breadcrumb-start */}
        <Breadcrumb
          toolkit={true}
          toolkitData={toolkitData}
          currentMenu={false}
          mainMenu={t("Breadcrumb.apa_Management.apa_Management")}
          subMenu={t("Breadcrumb.apa_Management.apaCalendars")}
          subSubMenu={false}
        />
        {/* breadcrumb-end */}

        <Card>
          <Card.Body>
            <Row>
              <Col lg={3} md={12} sm={12}>
                <div id="external-events">
                  <div className="d-flex justify-content-between mx-2">
                    <h5 className="fw-bolder pt-2 m-0">
                      {" "}
                      {t("APACalendar.table")}
                    </h5>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{t("CommonBtn.add")}</Tooltip>}
                    >
                      <Button
                        variant="none"
                        className="btn btn-md bg-none p-0"
                        onClick={handleOpenModal}
                      >
                        <i
                          className="icon ion-md-add-circle text-light-success"
                          style={{ fontSize: "30px" }}
                        ></i>
                      </Button>
                    </OverlayTrigger>
                  </div>

                  <div class="div d-flex justify-content-end mx-3 mt-3">
                    <Button
                      variant="none"
                      className="btn btn-light-success text-light w-100"
                      onClick={handleOpenListViewModal}
                    >
                      {t("APACalendar.listView")} <i className="fa fa-list"></i>{" "}
                    </Button>
                  </div>
                </div>
                <div></div>
              </Col>

              <Col lg={9} md={12} sm={12} className="calendarContainer">
                <div id="calendar2">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                      // left: "prev,next today",
                      left: "prev,next",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    initialView="dayGridMonth"
                    // locale="bn"
                    locale={i18n.language === "en" ? 'en' : bnLocale}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    events={apaCalenderData}

                    // select={handleDateSelect}
                    eventClick={handleEventClick}
                  />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {showModal && (
          <APACalenderModal
            control={control}
            reset={reset}
            errors={errors}
            btnState={btnState}
            register={register}
            showModal={showModal}
            setBtnState={setBtnState}
            handleSubmit={handleSubmit}
            setShowModal={setShowModal}
            // selectedInfo={selectedInfo}
            // setSelectedInfo={setSelectedInfo}
            updateAPACalenderData={updateAPACalenderData}
            setUpdateAPACalenderData={setUpdateAPACalenderData}
          />
        )}
        {showTableModal && (
          <APACalenderTableModal
            reset={reset}
            showTableModal={showTableModal}
            setShowTableModal={setShowTableModal}
          />
        )}
      </div>
    );
  } else { //if there is no data
    return (

      <div className="main-container container">
        {/* breadcrumb-start */}
        <Breadcrumb
          toolkit={true}
          toolkitData={toolkitData}
          currentMenu={false}
          mainMenu={t("Breadcrumb.apa_Management.apa_Management")}
          subMenu={t("Breadcrumb.apa_Management.template")}
          subSubMenu={false}
        />
        {/* breadcrumb-end */}

        <Card>
          <Card.Body>
            <Row>
              <Col lg={3} md={12} sm={12}>
                <div id="external-events">
                  <div className="d-flex justify-content-between mx-2">
                    <h5 className="fw-bolder pt-2 m-0">
                      {" "}
                      {t("APACalendar.table")}
                    </h5>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{t("CommonBtn.add")}</Tooltip>}
                    >
                      <Button
                        variant="none"
                        className="btn btn-md bg-none p-0"
                        onClick={handleOpenModal}
                      >
                        <i
                          className="icon ion-md-add-circle text-light-success"
                          style={{ fontSize: "30px" }}
                        ></i>
                      </Button>
                    </OverlayTrigger>
                  </div>

                  <div class="div d-flex justify-content-end mx-3 mt-3">
                    <Button
                      variant="none"
                      className="btn btn-light-success text-light w-100"
                      onClick={handleOpenListViewModal}
                    >
                      {t("APACalendar.listView")} <i className="fa fa-list"></i>{" "}
                    </Button>
                  </div>
                </div>
                <div></div>
              </Col>

              <Col lg={9} md={12} sm={12} className="calendarContainer">
                <div id="calendar2">

                  <div className="text-center">
                    <NotFoundAnimation width={250} height={250} />
                    <h4 className="text-size-20" style={{ color: "#3C21F7" }}>
                      {t("Common.filterDataMessage")}
                    </h4>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {showModal && (
          <APACalenderModal
            control={control}
            reset={reset}
            errors={errors}
            btnState={btnState}
            register={register}
            showModal={showModal}
            setBtnState={setBtnState}
            handleSubmit={handleSubmit}
            setShowModal={setShowModal}
            // selectedInfo={selectedInfo}
            // setSelectedInfo={setSelectedInfo}
            updateAPACalenderData={updateAPACalenderData}
            setUpdateAPACalenderData={setUpdateAPACalenderData}
          />
        )}
        {showTableModal && (
          <APACalenderTableModal
            reset={reset}
            showTableModal={showTableModal}
            setShowTableModal={setShowTableModal}
          />
        )}

      </div>



    )
  }
}
export default APACalendar;
