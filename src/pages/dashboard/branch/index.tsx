import DataTable, { IHeader } from "components/datatable";
import { useState, useEffect, useCallback, useRef } from "react";
import { Badge, Button, Input, Modal, Select } from "react-daisyui";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import useOperatingAreaQuery from "hooks/operating-area/useOperatingAreaQuery";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useOperatingAreaMutation from "hooks/operating-area/useOperatingAreaMutation";
import { CreateBranchReqI } from "_interfaces/auth-api.interfaces";

interface Props {}

enum TabValue {
  ACTIVE = 1,
  INACTIVE = 2,
}

const Branch: React.FC<Props> = (): JSX.Element => {
  const [deleteModalData, setDeleteModalData] = useState<string>();
  const [selectedId, setSelectedId] = useState<string>();
  const modalForm = useRef<HTMLDialogElement>(null);
  const { getBranch, getOperatingArea } = useOperatingAreaQuery();
  const operatingAreaQuery = getOperatingArea();
  const { data, isLoading } = getBranch();
  const { createBranch } = useOperatingAreaMutation();

  const handleShowFormModal = useCallback((id?: string | undefined) => {
    setSelectedId(id);
    modalForm.current?.showModal();
  }, []);

  const headers: IHeader[] = [
    {
      text: "Name",
      value: "name",
      rowStyles: () => "max-w-[120px] flex",
    },
    {
      text: "Email",
      value: "email",
      rowStyles: () => "max-w-[120px] flex",
    },
    {
      text: "Status",
      value: "",
      rowStyles: () => "flex justify-start w-[70px]",
      rowData: (data) => (
        <Badge color={data.isOnline ? "success" : "error"} className="text-white" size="md">
          {data.isOnline ? "Online" : "Offline"}
        </Badge>
      ),
    },
  ];

  const schema = yup
    .object({
      name: yup.string().required(),
      email: yup.string().email().required(),
      operatingAreaId: yup.string().required(),
    })
    .required();

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<CreateBranchReqI>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: CreateBranchReqI) => {
    createBranch.mutate(data);
  };

  useEffect(() => {
    if (createBranch.isSuccess) {
      modalForm.current?.close();
    }
  }, [createBranch.isSuccess]);

  useEffect(() => {
    if (selectedId && data?.data) {
      const name = data?.data.find((item) => item.id === selectedId)?.name;
      reset({ name });
    } else {
      reset({ name: undefined });
    }
  }, [selectedId, data?.data]);

  return (
    <>
      <div className="bg-white rounded-lg p-2 w-full overflow-x-scroll">
        <h2 className="text-xl font-bold pb-4">Branch Management</h2>
        <div className="w-full flex items-center justify-end mb-6">
          <Button
            color="primary"
            className="text-white"
            onClick={() => {
              handleShowFormModal();
            }}
          >
            <FiPlus size={15} />
            Create Branch
          </Button>
        </div>

        <DataTable
          loading={isLoading}
          dataSource={data?.data}
          headers={headers}
        />
      </div>

      {/* Create modal */}
      <Modal
        backdrop={true}
        ref={modalForm}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header className="font-bold">
            {selectedId ? "Update Branch" : "Create Branch"}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col w-full gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                type="text"
                placeholder="Enter Name"
                {...register("name")}
              />
              {errors.name?.message && (
                <p className="text-xs text-red-400 text-right">
                  {errors.name?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col w-full gap-2 mt-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="text"
                placeholder="Enter Email"
                {...register("email")}
              />
              {errors.email?.message && (
                <p className="text-xs text-red-400 text-right">
                  {errors.email?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col w-full gap-2 mt-2">
              <label className="text-sm font-medium">Operating Area</label>
              <Select {...register("operatingAreaId")}>
                <>
                  {operatingAreaQuery.data?.data?.map((item) => (
                    <Select.Option
                      value={item.id}
                      key={item.id}
                    >
                      {item.name}
                    </Select.Option>
                  ))}
                </>
              </Select>
              {errors.email?.message && (
                <p className="text-xs text-red-400 text-right">
                  {errors.email?.message}
                </p>
              )}
            </div>
          </Modal.Body>
          <Modal.Actions>
            <Button
              color="primary"
              className="text-white"
              type="submit"
              loading={createBranch.isLoading}
            >
              Save
            </Button>
            <Button
              onClick={() => modalForm.current?.close()}
              type="reset"
            >
              Close
            </Button>
          </Modal.Actions>
        </form>
      </Modal>
    </>
  );
};

export default Branch;
