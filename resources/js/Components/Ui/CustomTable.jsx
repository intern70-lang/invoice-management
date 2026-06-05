import { Table } from "antd";

export default function CustomTable({
    columns,
    data,
    rowKey,
    pagination = false,
    className = "",
}) {
    return (
        <div
            className={`bg-(--bg-table) border border-(--border-color,rgba(128,128,128,0.2)) rounded-xl card p-2 ${className}`}
        >
            <Table
                columns={columns}
                dataSource={data}
                rowKey={rowKey}
                pagination={pagination}
                className="w-full"
            />
        </div>
    );
}
