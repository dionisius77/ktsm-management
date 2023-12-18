import DataTable, { IHeader } from "components/datatable";
import { useState, Fragment, useEffect, useCallback, useRef } from "react";
import { Button, Input, Modal } from "react-daisyui";
import { Dialog, Transition } from "@headlessui/react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import { db } from "_services/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { ProductI } from "_interfaces/product.interfaces";
import { toast } from "react-toastify";
import useOperatingAreaQuery from "hooks/operating-area/useOperatingAreaQuery";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useOperatingAreaMutation from "hooks/operating-area/useOperatingAreaMutation";

interface Props {}

enum TabValue {
  ACTIVE = 1,
  INACTIVE = 2,
}

const OperatingArea: React.FC<Props> = (): JSX.Element => {
  const [deleteModalData, setDeleteModalData] = useState<string>();
  const [selectedId, setSelectedId] = useState<string>();
  const modalRef = useRef<HTMLDialogElement>(null);
  const modalForm = useRef<HTMLDialogElement>(null);
  const { getOperatingArea } = useOperatingAreaQuery();
  const { data, isLoading, isFetching, refetch } = getOperatingArea();
  const { createOperatingArea, updateOperatingArea, deleteOperatingArea } =
    useOperatingAreaMutation();

  const handleShowFormModal = useCallback((id?: string | undefined) => {
    setSelectedId(id);
    modalForm.current?.showModal();
  }, []);

  const handleShowDeleteConfirmation = useCallback((id: string) => {
    setDeleteModalData(id);
    modalRef.current?.showModal();
  }, []);

  const headers: IHeader[] = [
    {
      text: "Name",
      value: "name",
      rowStyles: () => "max-w-[120px] flex",
    },
    {
      text: "Actions",
      value: "",
      rowStyles: () => "flex justify-center w-[70px]",
      rowData: (data) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              handleShowFormModal(data.id);
            }}
          >
            <FiEdit
              className="cursor-pointer hover:bg-slate-200"
              size={20}
            />
          </button>
          <button
            onClick={() => {
              handleShowDeleteConfirmation(data.id);
            }}
            type="button"
          >
            <FiTrash
              className="cursor-pointer hover:bg-slate-200"
              size={20}
            />
          </button>
        </div>
      ),
    },
  ];

  const schema = yup
    .object({
      name: yup.string().required(),
    })
    .required();

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<{ name: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: { name: string }) => {
    if (selectedId) {
      updateOperatingArea.mutate({ id: selectedId, name: data.name });
    } else {
      createOperatingArea.mutate(data.name);
    }
  };

  useEffect(() => {
    if (
      updateOperatingArea.isSuccess ||
      createOperatingArea.isSuccess ||
      deleteOperatingArea.isSuccess
    ) {
      modalForm.current?.close();
      modalRef.current?.close();
      refetch();
    }
  }, [
    updateOperatingArea.isSuccess,
    createOperatingArea.isSuccess,
    deleteOperatingArea.isSuccess,
  ]);

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
        <h2 className="text-xl font-bold pb-4">Operating Area Management</h2>
        <div className="w-full flex items-center justify-end mb-6">
          <Button
            color="primary"
            className="text-white"
            onClick={() => {
              handleShowFormModal();
            }}
          >
            <FiPlus size={15} />
            Create Operating Area
          </Button>
        </div>

        <DataTable
          loading={isLoading}
          dataSource={data?.data}
          headers={headers}
        />
      </div>

      {/* Delete confirmation modal */}
      <Modal
        backdrop={true}
        ref={modalRef}
      >
        <Modal.Header className="font-bold">
          Are you sure want to delete?
        </Modal.Header>
        <Modal.Body>
          Press ESC key or click the button below to close
        </Modal.Body>
        <Modal.Actions>
          <Button
            onClick={() => {
              if (deleteModalData) {
                deleteOperatingArea.mutate(deleteModalData);
              }
            }}
            color="primary"
            className="text-white"
          >
            Yes, sure
          </Button>
          <Button onClick={() => modalRef.current?.close()}>Close</Button>
        </Modal.Actions>
      </Modal>

      {/* Create or update modal */}
      <Modal
        backdrop={true}
        ref={modalForm}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header className="font-bold">
            {selectedId ? "Update Operating Area" : "Create Operating Area"}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col w-full gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                type="text"
                placeholder="Enter Name"
                // className="bg-white focus:!outline-none focus:ring-0 focus:border-none rounded-md h-10 border-gray-300 border w-full"
                {...register("name")}
              />
              {errors.name?.message && (
                <p className="text-xs text-red-400 text-right">
                  {errors.name?.message}
                </p>
              )}
            </div>
          </Modal.Body>
          <Modal.Actions>
            <Button
              color="primary"
              className="text-white"
              type="submit"
              loading={
                updateOperatingArea.isLoading || createOperatingArea.isLoading
              }
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

export default OperatingArea;
