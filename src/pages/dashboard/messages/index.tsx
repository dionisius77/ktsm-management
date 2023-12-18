import DataTable, { IHeader } from "components/datatable";
import { useState, useEffect, useCallback, useRef } from "react";
import { Badge, Button, Input, Modal, Select } from "react-daisyui";
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
import { CreateBranchReqI } from "_interfaces/auth-api.interfaces";
import useMessageQuery from "hooks/message/useMessageQuery";
import { GetMessagesParamsI } from "_interfaces/message-api.interfaces";

interface Props {}

enum TabValue {
  ACTIVE = 1,
  INACTIVE = 2,
}

const MessagesPage: React.FC<Props> = (): JSX.Element => {
  const modalForm = useRef<HTMLDialogElement>(null);
  const [params, setParams] = useState<GetMessagesParamsI>({
    page: 1,
    size: 100,
  });
  const { getMessages } = useMessageQuery();
  const { data, isLoading } = getMessages(params);

  const headers: IHeader[] = [
    {
      text: "Title",
      value: "title",
    },
    {
      text: "Action",
      value: "",
      rowStyles: () => "flex justify-start w-[70px]",
      rowData: (data) => (
        <Link to={`/message/${data.id}`}>
          <button>
            <FiEdit
              className="cursor-pointer hover:bg-slate-200"
              size={20}
            />
          </button>
        </Link>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg p-2 w-full overflow-x-scroll">
      <h2 className="text-xl font-bold pb-4">Messages Management</h2>
      <div className="w-full flex items-center justify-end mb-6">
        <Link to="/message/create">
          <Button
            color="primary"
            className="text-white"
          >
            <FiPlus size={15} />
            Create Message
          </Button>
        </Link>
      </div>

      <DataTable
        loading={isLoading}
        dataSource={data?.data}
        headers={headers}
      />
    </div>
  );
};

export default MessagesPage;
