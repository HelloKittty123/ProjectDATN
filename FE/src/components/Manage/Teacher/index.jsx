import * as classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";

import styles from "./Teacher.module.scss";
import AddEditTeacher from "./AddEditTeacher";
import { useEffect, useState } from "react";
import ListTeacher from "./ListTeacher";
import { read, utils } from "xlsx";
import AddListTeacher from "./AddListTeacher";
import { getTeacherAPI } from "../../../services/teacherService";

const cx = classNames.bind(styles);

function Teacher() {
    const [isShow, setIsShow] = useState(false);
    const [fileName, setFileName] = useState("");
    const [showAddList, setShowAddList] = useState(false);
    const [listAdd, setListAdd] = useState([]);
    const [listTeacher, setListTeacher] = useState([]);

    const getTeacher = async (search) => {
        const dataAPI = await getTeacherAPI(search);
        setListTeacher(dataAPI);
    };

    useEffect(() => {
        getTeacher();
    }, []);

    const handleClickShowAddForm = () => {
        setIsShow(!isShow);
    };

    const handleAddByImport = ($event) => {
        const files = $event.target.files;

        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    const listAddImport = rows.map((item) => {
                        return {
                            id: item["Id"],
                            fullName: item["Họ và tên"],
                            age: item["Tuổi"],
                            gender: item["Giới tính"],
                            ethnic: item["Dân tộc"],
                            birthDay: item["Ngày tháng năm sinh"],
                            email: item["Email"],
                            address: item["Địa chỉ"],
                            phone: item["Số điên thoại"],
                            level:
                                item["Bằng cấp"] === "Cử nhân"
                                    ? 1
                                    : item["Bằng cấp"] === "Thạc sĩ"
                                    ? 2
                                    : item["Bằng cấp"] === "Tiến sĩ"
                                    ? 3
                                    : item["Bằng cấp"] === "Phó giáo sư"
                                    ? 4
                                    : 5,
                            status: 1,
                        };
                    });
                    setListAdd(listAddImport);
                    setShowAddList(true);
                    setFileName(file.name);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div className={cx("manage-teacher")}>
            <h2 className={cx("manage-teacher-title")}>QUẢN LÝ GIÁO VIÊN</h2>
            <div className={cx("manage-teacher-content")}>
                <div className={cx("list-button")}>
                    <div className={cx("show-add")}>
                        <button
                            className={cx("button-show-add")}
                            onClick={handleClickShowAddForm}
                        >
                            Thêm giáo viên
                        </button>
                    </div>

                    <input
                        type="file"
                        name="file"
                        className={cx("custom-file-input")}
                        id="inputGroupFile"
                        required
                        hidden
                        onChange={handleAddByImport}
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    />
                    <label
                        className={cx("custom-file-label")}
                        htmlFor="inputGroupFile"
                    >
                        Thêm bằng file
                    </label>
                    <AddListTeacher
                        show={showAddList}
                        setShow={setShowAddList}
                        listTeacherAdd={listAdd}
                        fileName={fileName}
                        getTeacher={getTeacher}
                    />
                </div>
                {isShow && (
                    <AddEditTeacher
                        action="add"
                        show={isShow}
                        showAdd={handleClickShowAddForm}
                        getTeacher={getTeacher}
                    />
                )}
                <ListTeacher
                    listTeacher={listTeacher}
                    getTeacher={getTeacher}
                />
            </div>
        </div>
    );
}

export default Teacher;
