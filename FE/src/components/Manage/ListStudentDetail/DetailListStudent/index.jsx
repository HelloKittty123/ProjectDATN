import * as classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { Button, FormSelect, Modal, Table } from "react-bootstrap";
import { Form, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { utils, writeFile } from "xlsx";
import { getClassAPI, updateClassAPI } from "../../../../services/classService";
import {
    deleteStudentClassAPI,
    updateStudentClassAPI,
} from "../../../../services/studentClassService";
import DetailStudent from "../../Student/DetailStudent";

import FindListStudentDetail from "../FindListStudentDetail";
import styles from "./DetailListStudent.module.scss";

const cx = classNames.bind(styles);

function DetailListStudent({ listStudentClass, getStudentClass }) {
    const { gradeName, academicYear, classId } = useParams();

    const [listStudentClassExport, setListStudentClassExport] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [idUpdate, setIdUpdate] = useState("");
    const [isDetail, setIsDetail] = useState(false);
    const [studentClassShow, setStudentClassShow] = useState({});
    const [listClass, setListClass] = useState([]);
    const [classSelect, SetClassSelect] = useState(classId);

    const getClassOption = async () => {
        const dataAPI = await getClassAPI(gradeName, academicYear);
        setListClass(dataAPI);
    };

    useEffect(() => {}, []);

    useEffect(() => {
        const lstExport = listStudentClass.map((item) => {
            return {
                id: item.studentId,
                fullName: item.fullName,
                age: item.age,
                gender: item.gender,
                ethnic: item.ethnic,
                dob: item.birthDay,
                email: item.email,
                address: item.address,
                phone: item.phone,
                fatherName: item.fatherName,
                fatherPhone: item.fatherPhone,
                fatherCareer: item.fatherCareer,
                motherName: item.motherName,
                motherPhone: item.motherPhone,
                motherCareer: item.motherCareer,
                status: item.status === 1 ? "??ang h???c" : "Ngh??? h???c",
            };
        });
        setListStudentClassExport(lstExport);
    }, [listStudentClass]);

    const handleExport = () => {
        const headings = [
            [
                "Id",
                "H??? v?? t??n",
                "Tu???i",
                "Gi???i t??nh",
                "D??n t???c",
                "Ng??y th??ng n??m sinh",
                "Email",
                "?????a ch???",
                "S??? ??i???n tho???i",
                "T??n b???",
                "S??? ??i???n tho???i b???",
                "Ngh??? nghi???p b???",
                "T??n m???",
                "S??? ??i???n tho???i m???",
                "Ngh??? nghi???p m???",
                "T??nh tr???ng h???c t???p",
            ],
        ];
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, listStudentClassExport, {
            origin: "A2",
            skipHeader: true,
        });
        utils.book_append_sheet(wb, ws, "Report");
        writeFile(wb, "StudentClassReport.xlsx");
    };

    const handleConfirmUpdate = async (id) => {
        await getClassOption();
        setIdUpdate(id);
        setIsUpdate(true);
    };

    const handleOnChange = (e) => {
        SetClassSelect(e.target.value);
    };

    const handleUpdateStudentClass = async (e) => {
        const response = await updateStudentClassAPI(idUpdate, classSelect);
        if (response.message === "Success") {
            toast.success("Chuy???n l???p th??nh c??ng");
            await getStudentClass();
        } else {
            toast.error("Chuy???n l???p th???t b???i");
        }

        setIdUpdate("");
        SetClassSelect(classId);
        setIsUpdate(false);
    };

    const handleClickDetailInfo = (stu) => {
        if (!isDetail) setStudentClassShow(stu);
        else setStudentClassShow({});
        setIsDetail(!isDetail);
    };

    const handleSearch = async (input) => {
        await getStudentClass(input);
    };

    return (
        <div className={cx("list-student-class")}>
            <FindListStudentDetail handleSearch={handleSearch} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    variant="warning"
                    onClick={handleExport}
                    className={cx("button-export")}
                >
                    Xu???t file
                </Button>
            </div>

            <Table striped hover>
                <thead>
                    <tr>
                        <th className={cx("table-head")}>STT</th>
                        <th className={cx("table-head")}>ID</th>
                        <th className={cx("table-head")}>H??? v?? t??n</th>
                        <th className={cx("table-head")}>S??? ??i???n tho???i</th>
                        <th className={cx("table-head")}>T??nh tr???ng h???c t???p</th>
                        <th className={cx("table-head")}></th>
                    </tr>
                </thead>
                <tbody>
                    {listStudentClass.map((sc, index) => {
                        return (
                            <tr key={sc.id}>
                                <td className={cx("table-document")}>
                                    {index + 1}
                                </td>
                                <td className={cx("table-document")}>
                                    {sc.studentId}
                                </td>
                                <td className={cx("table-document")}>
                                    {sc.fullName}
                                </td>
                                <td className={cx("table-document")}>
                                    {sc.phone}
                                </td>
                                <td className={cx("table-document")}>
                                    {sc.status === 0 ? "Ngh??? h???c" : "??ang h???c"}
                                </td>

                                <td className={cx("list-button")}>
                                    <Button
                                        variant="info"
                                        className={cx("button")}
                                        onClick={() =>
                                            handleClickDetailInfo(sc)
                                        }
                                    >
                                        Xem chi ti???t
                                    </Button>

                                    {sc.status === 1 && (
                                        <Button
                                            variant="success"
                                            className={cx("button")}
                                            onClick={() =>
                                                handleConfirmUpdate(sc.id)
                                            }
                                        >
                                            Chuy???n l???p
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            {isDetail && (
                <DetailStudent
                    studentShow={studentClassShow}
                    show={isDetail}
                    showDetail={handleClickDetailInfo}
                />
            )}

            <Modal
                show={isUpdate}
                onHide={() => setIsUpdate(false)}
                dialogClassName={cx("modal")}
                centered
            >
                <Modal.Header>
                    <Modal.Title className={cx("modal-title")}>
                        Ch???n l???p mu???n chuy???n
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={cx("modal-content")}>
                    <FormSelect
                        value={classSelect}
                        onChange={handleOnChange}
                        className={cx("form-select")}
                    >
                        {listClass.map((item) => {
                            return <option value={item.id}>{item.name}</option>;
                        })}
                    </FormSelect>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        className={cx("button-confirm")}
                        onClick={handleUpdateStudentClass}
                    >
                        X??c nh???n
                    </Button>
                    <Button
                        variant="secondary"
                        className={cx("button-back")}
                        onClick={() => setIsUpdate(false)}
                    >
                        Quay l???i
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DetailListStudent;
