import { Breadcrumb, Select, Button, Space, DatePicker, message } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FileExcelOutlined } from "@ant-design/icons";
import ExcelJS from "exceljs";
import {
  getRevenueByPeriod,
  getTotalRevenueAPI,
} from "../../services/api.service.analytic";
import { getAllProductAPI } from "../../services/api.service.product";
import { getAllOrderAPI } from "../../services/api.service.order";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ExportPage = () => {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [fileFormat] = useState("excel");

  const handleExport = async () => {
    if (!reportType) {
      message.error("Vui lòng chọn loại báo cáo!");
      return;
    }
    if (!dateRange || dateRange.length !== 2) {
      message.error("Vui lòng chọn khoảng thời gian!");
      return;
    }

    try {
      const startDate = dateRange[0].toISOString();
      const endDate = dateRange[1].toISOString();

      let response;
      let worksheetData = [];
      let title = "";

      // Xử lý từng loại báo cáo
      switch (reportType) {
        case "revenue":
          response = await getTotalRevenueAPI({
            startDate: startDate,
            endDate: endDate,
          });
          const { value: totalRevenue, diff } = response.data.result;
          const revenueByPeriod = await getRevenueByPeriod({
            startDate: startDate,
            endDate: endDate,
          });
          title = "BÁO CÁO DOANH THU";
          worksheetData = [
            [title],
            [
              `Từ ${dateRange[0].format(
                "DD/MM/YYYY"
              )} đến ${dateRange[1].format("DD/MM/YYYY")}`,
            ],
            [],
            ["Sự thay đổi (%)", `${diff}%`],
            [
              "Tổng doanh thu",
              totalRevenue.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }),
            ],
            [],
            ["Ngày", "Doanh thu (VNĐ)"],
            ...revenueByPeriod.data.result.map((item) => [
              item.date,
              item.value.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }),
            ]),
          ];
          break;

        case "inventory":
          response = await getAllProductAPI();
          title = "BÁO CÁO TỒN KHO";
          worksheetData = [
            [title],
            [
              `Từ ${dateRange[0].format(
                "DD/MM/YYYY"
              )} đến ${dateRange[1].format("DD/MM/YYYY")}`,
            ],
            [],
            ["Tên sản phẩm", "Số lượng tồn", "Giá trị tồn kho (VNĐ)"],
            ...response.data.result.map((item) => [
              item.name,
              item.stock,
              (item.stock * item.price).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }),
            ]),
          ];
          break;

        case "sales":
          response = await getAllProductAPI(1, 1000, {
            sortBy: "sold",
            order: "desc",
            startDate,
            endDate,
          });
          title = "BÁO CÁO BÁN HÀNG";
          worksheetData = [
            [title],
            [
              `Từ ${dateRange[0].format(
                "DD/MM/YYYY"
              )} đến ${dateRange[1].format("DD/MM/YYYY")}`,
            ],
            [],
            ["Tên sản phẩm", "Số lượng bán", "Doanh thu (VNĐ)"],
            ...response.data.result.map((item) => [
              item.name,
              item.sold || 0,
              (item.sold * item.price).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }),
            ]),
          ];
          break;

        case "orders":
          response = await getAllOrderAPI(1, 1000, { startDate, endDate });
          title = "BÁO CÁO ĐƠN HÀNG";
          worksheetData = [
            [title],
            [
              `Từ ${dateRange[0].format(
                "DD/MM/YYYY"
              )} đến ${dateRange[1].format("DD/MM/YYYY")}`,
            ],
            [],
            ["Mã đơn hàng", "Ngày", "Trạng thái", "Tổng tiền (VNĐ)"],
            ...response.data.result.map((order) => [
              order.displayCode,
              new Date(order.createdAt).toLocaleDateString("vi-VN"),
              order.status,
              order.totalAmount.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }),
            ]),
          ];
          break;

        default:
          throw new Error("Loại báo cáo không hợp lệ!");
      }

      // Tạo workbook và worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(title.replace(/ /g, ""));

      // Thêm dữ liệu
      worksheet.addRows(worksheetData);

      // Áp dụng định dạng
      // Tiêu đề (dòng 1)
      worksheet.getCell("A1").font = {
        name: "Calibri",
        size: 16,
        bold: true,
        color: { argb: "FFFFFF" },
      };
      worksheet.getCell("A1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1A73E8" },
      };
      worksheet.mergeCells("A1:C1");
      worksheet.getCell("A1").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Dòng thời gian (dòng 2)
      worksheet.getCell("A2").font = {
        name: "Calibri",
        italic: true,
        color: { argb: "555555" },
      };
      worksheet.mergeCells("A2:C2");
      worksheet.getCell("A2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Tiêu đề cột
      const headerRow = worksheet.getRow(4); // Dòng 4 là tiêu đề cột
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "BBDEFB" },
        };
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // Định dạng dữ liệu
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 4) {
          // Bắt đầu từ dòng dữ liệu
          row.eachCell((cell, colNumber) => {
            const isNumberColumn = colNumber > 1; // Cột số bắt đầu từ cột 2
            cell.border = {
              top: { style: "thin", color: { argb: "D3D3D3" } },
              bottom: { style: "thin", color: { argb: "D3D3D3" } },
              left: { style: "thin", color: { argb: "D3D3D3" } },
              right: { style: "thin", color: { argb: "D3D3D3" } },
            };
            cell.alignment = isNumberColumn
              ? { horizontal: "center", vertical: "middle" }
              : { horizontal: "left", vertical: "middle" };

            // Tô màu cảnh báo cho tồn kho
            if (
              reportType === "inventory" &&
              colNumber === 2 &&
              parseInt(cell.value) < 5
            ) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFCDD2" },
              };
            }
          });
        }
      });

      // Định dạng dòng tổng hợp (cho revenue)
      if (reportType === "revenue") {
        [2, 3].forEach((rowOffset) => {
          const row = worksheet.getRow(rowOffset);
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF9C4" },
            };
            cell.border = {
              top: { style: "thin", color: { argb: "D3D3D3" } },
              bottom: { style: "thin", color: { argb: "D3D3D3" } },
              left: { style: "thin", color: { argb: "D3D3D3" } },
              right: { style: "thin", color: { argb: "D3D3D3" } },
            };
            cell.alignment =
              cell.col === 1
                ? { horizontal: "center", vertical: "middle" }
                : { horizontal: "left", vertical: "middle" };
          });
        });
      }

      // Điều chỉnh độ rộng cột
      worksheet.columns = [{ width: 25 }, { width: 15 }, { width: 20 }];

      // Xuất file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}_${startDate}_${endDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      message.success("Xuất báo cáo thành công!");
    } catch (error) {
      message.error("Lỗi xuất báo cáo: " + error.message);
    }
  };

  return (
    <div className="p-3 bg-gray-100 min-h-screen">
      <Breadcrumb
        className="mb-6"
        items={[
          { title: <Link to="/">Tổng quan</Link> },
          { title: "Quản lý" },
          { title: "Xuất báo cáo" },
        ]}
      />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Xuất báo cáo</h2>
        <Space direction="vertical" size="middle" className="w-full">
          <div>
            <label className="block mb-2 font-medium">Loại báo cáo:</label>
            <Select
              placeholder="Chọn loại báo cáo"
              style={{ width: 300 }}
              onChange={(value) => setReportType(value)}
              value={reportType || undefined}
            >
              <Option value="revenue">Báo cáo doanh thu</Option>
              <Option value="inventory">Báo cáo tồn kho</Option>
              <Option value="sales">Báo cáo bán hàng</Option>
              <Option value="orders">Báo cáo đơn hàng</Option>
            </Select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Khoảng thời gian:</label>
            <RangePicker
              onChange={(dates) => setDateRange(dates)}
              value={dateRange}
              format="DD/MM/YYYY"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Định dạng file:</label>
            <Select style={{ width: 150 }} value={fileFormat} disabled>
              <Option value="excel">Excel</Option>
            </Select>
          </div>

          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={handleExport}
          >
            Xuất báo cáo
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ExportPage;
