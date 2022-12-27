import * as classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { utils, writeFile } from "xlsx";

import { deleteStudent, getStudent } from "../../../../slices/studentSlice";
import AddEditStudent from "../AddEditStudent";
import styles from "./ListStudent.module.scss";
import FindStudent from "../FindStudent";
import DetailStudent from "../DetailStudent";
import { getStudentAPI } from "../../../../services/getRequest";

const cx = classNames.bind(styles);

function ListStudent() {
    const data = useSelector((state) => state.student.listStudent);

    const [listStudent, setListStudent] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [isShow, setIsShow] = useState(false);
    const [isDetail, setIsDetail] = useState(false);
    const [studentShow, setStudentShow] = useState({});
    const [search, setSearch] = useState("");

    const dispatch = useDispatch();

    const getStudent = async () => {
        const data = await getStudentAPI(pageIndex, search);
        console.log(data);
        setListStudent(data.data);
    };
    useEffect(() => {
        getStudent();
    }, []);

    useEffect(() => {
        setListStudent(data);
    }, [data]);

    const handleExport = () => {
        const headings = [
            [
                "Id",
                "Họ và tên",
                "Tuổi",
                "Giới tính",
                "Dân tộc",
                "Ngày tháng năm sinh",
                "Email",
                "Địa chỉ",
                "Số điện thoại",
                "Tên bố",
                "Số điện thoại bố",
                "Nghề nghiệp bố",
                "Tên mẹ",
                "Số điện thoại mẹ",
                "Nghề nghiệp mẹ",
                "Tình trạng học tập",
            ],
        ];
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, listStudent, {
            origin: "A2",
            skipHeader: true,
        });
        utils.book_append_sheet(wb, ws, "Report");
        writeFile(wb, "Student Report.xlsx");
    };

    const handleDeleteStudent = (id) => {
        dispatch(deleteStudent(id));
        toast.success("Xóa học sinh thành công");
    };

    const handleClickEditInfo = (stu) => {
        if (!isShow) setStudentShow(stu);
        else setStudentShow({});
        setIsShow(!isShow);
    };

    const handleClickDetailInfo = (stu) => {
        if (!isDetail) setStudentShow(stu);
        else setStudentShow({});
        setIsDetail(!isDetail);
    };

    // const handleSearch = useCallback(
    //     (input) => {
    //         if (input) {
    //             const checkList = listStudent.filter(
    //                 (stu) => stu.Id === input || stu.Name.includes(input)
    //             );

    //             setSearchList({ list: checkList, input });
    //         } else if (input !== searchList.input) {
    //             setSearchList({ list: [], input: "" });
    //         }
    //     },
    //     [listStudent, searchList.input]
    // );

    return (
        <div className={cx("list-student")}>
            {/* <FindStudent handleSearch={handleSearch} /> */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    variant="warning"
                    onClick={handleExport}
                    className={cx("button-export")}
                >
                    Xuất file
                </Button>
            </div>
            <Table striped hover>
                <thead>
                    <tr>
                        <th className={cx("table-head")}>ID</th>
                        <th className={cx("table-head")}>Tên học sinh</th>
                        <th className={cx("table-head")}>Tuổi</th>
                        <th className={cx("table-head")}>Email</th>
                        <th className={cx("table-head")}>Số điện thoại</th>
                        <th className={cx("table-head")}>Tình trạng học tập</th>
                        <th className={cx("table-head")}></th>
                    </tr>
                </thead>
                <tbody>
                    {listStudent.map((stu, index) => {
                        return (
                            <tr key={stu.Id}>
                                <td className={cx("table-document")}>
                                    {stu.id}
                                </td>
                                <td className={cx("table-document")}>
                                    {stu.fullName}
                                </td>
                                <td className={cx("table-document")}>
                                    {stu.age}
                                </td>
                                <td className={cx("table-document")}>
                                    {stu.email}
                                </td>
                                <td className={cx("table-document")}>
                                    {stu.phone}
                                </td>
                                <td className={cx("table-document")}>
                                    {stu.Status === "1"
                                        ? "Đang học"
                                        : "Nghỉ học"}
                                </td>
                                <td className={cx("list-button")}>
                                    <Button
                                        onClick={() =>
                                            handleDeleteStudent(stu.Id)
                                        }
                                        variant="danger"
                                        className={cx("button")}
                                    >
                                        Xóa
                                    </Button>

                                    <Button
                                        variant="success"
                                        onClick={() => handleClickEditInfo(stu)}
                                        className={cx("button")}
                                    >
                                        Sửa
                                    </Button>

                                    <Button
                                        variant="info"
                                        onClick={() =>
                                            handleClickDetailInfo(stu)
                                        }
                                        className={cx("button")}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            {isShow && (
                <AddEditStudent
                    studentShow={studentShow}
                    show={isShow}
                    showAdd={handleClickEditInfo}
                />
            )}
            {isDetail && (
                <DetailStudent
                    studentShow={studentShow}
                    show={isDetail}
                    showDetail={handleClickDetailInfo}
                />
            )}
        </div>
    );
}

export default ListStudent;
