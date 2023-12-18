import useMessageQuery from "hooks/message/useMessageQuery";
import { Link, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import { Button, Divider, Input, Modal, Select } from "react-daisyui";
import {
  ContentType,
  MessageLog,
  UpdateMessageLogsI,
  UpdateMessageReqI,
} from "_interfaces/message-api.interfaces";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DataTable, { IHeader } from "components/datatable";
import { FiEdit } from "react-icons/fi";
import moment from "moment";
import useMessagelMutation from "hooks/message/useMessageMutation";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "_services/firebase";
import { toast } from "react-toastify";
import { ApiErrorResponse } from "_network/response";

const MessageManagementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const editorRef = useRef<any>(null);
  const { getMessageLogsById, getMessageById } = useMessageQuery();
  const { updateMessageLogs } = useMessagelMutation();
  const messageLogs = getMessageLogsById(id ?? "");
  const messageById = getMessageById(id ?? "");
  const [selectedMessage, setSelectedMessage] = useState<MessageLog>();
  const [file, setFile] = useState<File>();
  const modalForm = useRef<HTMLDialogElement>(null);

  const schema = yup
    .object({
      contentType: yup.mixed<ContentType>().oneOf(Object.values(ContentType)),
      content: yup.string(),
      broadcastAt: yup.date().required(),
      expiredAt: yup.date().required(),
    })
    .required();

  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    reset,
  } = useForm<UpdateMessageLogsI>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { contentType, content } = watch();

  useEffect(() => {
    if (selectedMessage) {
      reset({
        content: selectedMessage.content ?? messageById.data?.data.content,
        contentType:
          selectedMessage.contentType ?? messageById.data?.data.contentType,
        broadcastAt: moment(selectedMessage.broadcastedAt).format(
          "yyyy-MM-DDThh:mm",
        ),
        expiredAt: moment(selectedMessage.expiredAt).format("yyyy-MM-DDThh:mm"),
      });
    }
  }, [selectedMessage]);

  const handleChangeFile = (e: any) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = (data: UpdateMessageLogsI) => {
    let payload = { ...data };
    if (data.contentType !== ContentType.Text) {
      if (file) {
        const storageRef = ref(storage, `/files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            );
          },
          () => toast.error("Upload file failed!"),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
              payload.content = url;
              updateMessageLogs.mutate({
                id: selectedMessage?.id ?? "",
                payload,
              });
            });
          },
        );
      } else {
        toast.error("Please choose a file");
      }
    } else {
      if (selectedMessage?.content) {
        payload.contentType = ContentType.Text;
        payload.content = editorRef.current.getContent();
      } else {
        if (editorRef.current.getContent() === messageById.data?.data.content) {
          payload.contentType = null;
          payload.content = null;
        } else {
          payload.content = editorRef.current.getContent();
        }
      }
      updateMessageLogs.mutate({
        id: selectedMessage?.id ?? "",
        payload,
      });
    }
  };

  useEffect(() => {
    if (updateMessageLogs.isSuccess) {
      modalForm.current?.close();
    }
    if (updateMessageLogs.isError) {
      console.error(updateMessageLogs.error);
      const error = updateMessageLogs.error as ApiErrorResponse;
      toast.error(error.message);
    }
  }, [updateMessageLogs.isSuccess, updateMessageLogs.isError]);

  const headers: IHeader[] = [
    {
      text: "Branch",
      value: "",
      rowData: (data: MessageLog) => {
        return data.branch.name;
      },
    },
    {
      text: "Broadcast At",
      value: "",
      rowData: (data: MessageLog) => {
        return moment(data.broadcastedAt).format("D MMM YYYY HH:mm");
      },
    },
    {
      text: "Expired At",
      value: "",
      rowData: (data: MessageLog) => {
        return moment(data.expiredAt).format("D MMM YYYY HH:mm");
      },
    },
    {
      text: "Content",
      value: "",
      rowData: (data: MessageLog) => {
        return data.content ? "Edited Content" : "Original Content";
      },
    },
    {
      text: "Opened At",
      value: "",
      rowData: (data: MessageLog) => {
        return data.deliveredAt
          ? moment(data.deliveredAt).format("D MMM YYYY HH:mm")
          : "-";
      },
    },
    {
      text: "Action",
      value: "",
      rowStyles: () => "flex justify-start w-[70px]",
      rowData: (data: MessageLog) => {
        console.log(data);
        return (
          <button
            onClick={() => {
              setSelectedMessage(data);
              modalForm.current?.showModal();
            }}
            disabled={data.isBroadcasted}
          >
            <FiEdit
              className={`cursor-pointer hover:bg-slate-200 ${
                data.isBroadcasted ? "text-gray-300" : "text-gray-700"
              }`}
              size={20}
            />
          </button>
        );
      },
    },
  ];

  return (
    <>
      <div className="bg-white rounded-lg p-2 w-full">
        <h2 className="text-2xl font-bold mb-6">Edit Message</h2>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-4 w-full gap-2">
            <label className="text-sm font-bold">Title</label>
            <div className="col-span-3">{messageById.data?.data.title}</div>
          </div>
          <div className="grid grid-cols-4 items-center w-full gap-2">
            <label className="text-sm font-bold">Content Type</label>
            <Select
              value={messageById.data?.data.contentType}
              disabled
            >
              <Select.Option value={ContentType.Text}>
                {ContentType.Text}
              </Select.Option>
              <Select.Option value={ContentType.Audio}>
                {ContentType.Audio}
              </Select.Option>
              <Select.Option value={ContentType.Video}>
                {ContentType.Video}
              </Select.Option>
            </Select>
          </div>
          <div className="grid grid-cols-4 w-full gap-2">
            <label className="text-sm font-bold">Original Content</label>
            <div className="col-span-3">
              {messageById.data?.data.contentType === ContentType.Audio ||
              messageById.data?.data.contentType === ContentType.Video ? (
                <audio controls>
                  <source src={messageById.data?.data.content} />
                </audio>
              ) : (
                <Editor
                  apiKey="qws268w8r6x1s5qjzh7qc5d3ora7v26vgand84pic751hh3l"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue={messageById.data?.data.content}
                  disabled
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "advcode",
                      "advtable",
                      "autolink",
                      "checklist",
                      "lists",
                      "link",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "powerpaste",
                      "fullscreen",
                      "formatpainter",
                      "insertdatetime",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | casechange blocks | bold italic backcolor | " +
                      "alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
                  }}
                />
              )}
            </div>
          </div>
          {/* <div className="flex items-end justify-end">
          <Button type="submit" color="success">Save</Button>
        </div> */}
        </div>
        <Divider />
        <div className="flex items-center justify-center mt-5 text-2xl font-bold">
          Edit for Specific Branch
        </div>
        <div className="my-10">
          <DataTable
            loading={messageLogs.isLoading}
            dataSource={messageLogs.data?.data}
            headers={headers}
          />
        </div>
      </div>

      <Modal
        backdrop={true}
        ref={modalForm}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header className="font-bold">
            {`Update Branch ${selectedMessage?.branch.name}`}
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="flex flex-col w-full gap-2">
                <label className="text-sm font-bold">Broadcast At</label>
                <Input
                  disabled={updateMessageLogs.isLoading}
                  type="datetime-local"
                  {...register("broadcastAt")}
                />
                {errors.broadcastAt?.message && (
                  <p className="text-xs text-red-400 text-right">
                    {errors.broadcastAt?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-full gap-2">
                <label className="text-sm font-bold">Expired At</label>
                <Input
                  disabled={updateMessageLogs.isLoading}
                  type="datetime-local"
                  placeholder="Enter Name"
                  {...register("expiredAt")}
                />
                {errors.expiredAt?.message && (
                  <p className="text-xs text-red-400 text-right">
                    {errors.expiredAt?.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 col-span-2 gap-2">
                <div className="flex flex-col w-full gap-2">
                  <label className="text-sm font-bold">Content Type</label>
                  <Select
                    {...register("contentType")}
                    disabled={updateMessageLogs.isLoading}
                  >
                    <Select.Option value={ContentType.Text}>
                      {ContentType.Text}
                    </Select.Option>
                    <Select.Option value={ContentType.Audio}>
                      {ContentType.Audio}
                    </Select.Option>
                    <Select.Option value={ContentType.Video}>
                      {ContentType.Video}
                    </Select.Option>
                  </Select>
                </div>
                {contentType === ContentType.Audio ||
                contentType === ContentType.Video ? (
                  <div className="flex flex-col w-full gap-2">
                    <label className="text-sm font-bold">Content</label>
                    <input
                      disabled={updateMessageLogs.isLoading}
                      type="file"
                      accept={
                        contentType === ContentType.Audio
                          ? "audio/*"
                          : "video/*"
                      }
                      onChange={handleChangeFile}
                    />
                  </div>
                ) : (
                  <div />
                )}
              </div>
              {contentType === ContentType.Text ? (
                <div className="w-full flex flex-col gap-2 col-span-2">
                  <label className="font-bold text-sm">Content</label>
                  <Editor
                    apiKey="qws268w8r6x1s5qjzh7qc5d3ora7v26vgand84pic751hh3l"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={content ?? ""}
                    disabled={updateMessageLogs.isLoading}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "advcode",
                        "advtable",
                        "autolink",
                        "checklist",
                        "lists",
                        "link",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "powerpaste",
                        "fullscreen",
                        "formatpainter",
                        "insertdatetime",
                        "table",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | casechange blocks | bold italic backcolor | " +
                        "alignleft aligncenter alignright alignjustify | " +
                        "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
                    }}
                  />
                  {/* <p className="text-red-500 text-sm">{errors.notes?.message}</p> */}
                </div>
              ) : null}
            </div>
          </Modal.Body>
          <Modal.Actions>
            <Button
              color="primary"
              className="text-white"
              type="submit"
              loading={updateMessageLogs.isLoading}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                modalForm.current?.close();
                setSelectedMessage(undefined);
              }}
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

export default MessageManagementDetail;
