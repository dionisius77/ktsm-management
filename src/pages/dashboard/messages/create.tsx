import useOperatingAreaQuery from "hooks/operating-area/useOperatingAreaQuery";
import { useEffect, useRef, useState } from "react";
import { Input, Select as DSelect, Button, Checkbox } from "react-daisyui";
import Select from "react-select";
import { Editor } from "@tinymce/tinymce-react";
import {
  ContentType,
  CreateMessageFormI,
  SelectOptionI,
  BranchesI,
  BranchesFormI,
  CreateMessageReqI,
} from "_interfaces/message-api.interfaces";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { BranchI } from "_interfaces/auth-api.interfaces";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "_services/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useMessagelMutation from "hooks/message/useMessageMutation";
import { ApiErrorResponse } from "_network/response";

const CreateMessage = () => {
  const { getBranch, getOperatingArea } = useOperatingAreaQuery();
  const { createMessage } = useMessagelMutation();
  const operatingAreaQuery = getOperatingArea();
  const { data, isLoading } = getBranch();
  const navigate = useNavigate();
  const [customizeTime, setCustomizeTime] = useState(false);
  const [broadcastValue, setBroadcastValue] = useState<any>([]);
  const [mapBranch, setMapBranch] = useState<Map<string, BranchI>>();
  const [file, setFile] = useState<File>();
  const [options, setOptions] = useState<
    Array<{
      label: JSX.Element;
      options: SelectOptionI[];
    }>
  >([]);
  const editorRef = useRef<any>(null);

  const schema = yup
    .object({
      title: yup.string().required(),
      contentType: yup.mixed<ContentType>().oneOf(Object.values(ContentType)),
      content: yup.string(),
      broadcastAt: yup.date().required(),
      expiredAt: yup.date().required(),
      broadcastTo: yup
        .array()
        .of(
          yup.object().shape({
            label: yup.string().required(),
            value: yup.string().required(),
          }),
        )
        .required(),
      branches: yup.array().of(
        yup.object().shape({
          branchId: yup.string().required(),
          broadcastAt: yup.date().required(),
          expiredAt: yup.date().required(),
        }),
      ),
    })
    .required();

  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    setValue,
    watch,
  } = useForm<CreateMessageFormI>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { broadcastTo, broadcastAt, expiredAt, contentType } = watch();
  const { fields } = useFieldArray({
    control,
    name: "branches",
  });

  useEffect(() => {
    if (broadcastTo && broadcastAt && expiredAt) {
      const branches: BranchesFormI[] = broadcastTo.map((item) => ({
        branchId: item.value,
        broadcastAt: broadcastAt,
        expiredAt: expiredAt,
      }));
      setValue("branches", branches);
    }
  }, [broadcastTo, broadcastAt, expiredAt]);

  const onSubmit = (data: CreateMessageFormI) => {
    // if (data.broadcastTo.length === 0) {
    //   setError(
    //     "broadcastTo",
    //     { message: "Broadcast to is required" },
    //   );
    // }
    let payload: CreateMessageReqI = {
      title: data.title,
      content: "",
      contentType: data.contentType,
      branches: [],
    };
    const branches: BranchesI[] = data.branches.map((item) => ({
      id: item.branchId,
      broadcastAt: item.broadcastAt,
      expiredAt: item.expiredAt,
    }));
    payload.branches = branches;
    if (data.contentType !== ContentType.Text && file) {
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
            createMessage.mutate(payload);
          });
        },
      );
    } else {
      payload.content = editorRef.current.getContent();
      createMessage.mutate(payload);
    }
  };

  useEffect(() => {
    setValue("broadcastTo", broadcastValue);
  }, [broadcastValue]);

  const createGroup = (groupName: string, opt: SelectOptionI[]) => {
    return {
      label: (() => {
        return (
          <div
            onClick={() =>
              setBroadcastValue((value: SelectOptionI[]) =>
                value.concat(opt.filter((grpOpt) => !value.includes(grpOpt))),
              )
            }
          >
            {groupName}
          </div>
        );
      })(),
      options: opt,
    };
  };

  useEffect(() => {
    if (data?.data && operatingAreaQuery.data?.data) {
      const operatingArea = operatingAreaQuery.data?.data;
      const branch = data?.data;
      const optionGroup = operatingArea.map((item) => {
        const optionTemp = branch.filter(
          (branch) => branch.operatingAreaId === item.id,
        );
        return createGroup(
          item.name,
          optionTemp.map((opt) => ({ label: opt.name, value: opt.id })),
        );
      });
      setOptions(optionGroup);
      let newMapBranch = new Map<string, BranchI>();
      branch.forEach((item) => newMapBranch.set(item.id, item));
      setMapBranch(newMapBranch);
    }
  }, [data?.data, operatingAreaQuery.data?.data]);

  const handleChangeFile = (e: any) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (createMessage.isSuccess) {
      navigate(-1);
    }
    if (createMessage.isError) {
      console.error(createMessage.error);
      const error = createMessage.error as ApiErrorResponse
      toast.error(error.message);
    }
  }, [createMessage.isSuccess, createMessage.isError]);

  return (
    <div className="bg-white rounded-lg p-2 w-full">
      <h2 className="text-xl font-bold pb-4">Messages Management</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 w-full"
      >
        <div className="flex flex-col w-full gap-2">
          <label className="text-sm font-bold">Title</label>
          <Input
            disabled={createMessage.isLoading}
            type="text"
            placeholder="Enter Title"
            {...register("title")}
          />
          {errors.title?.message && (
            <p className="text-xs text-red-400 text-right">
              {errors.title?.message}
            </p>
          )}
        </div>
        <div className="flex flex-col w-full gap-2">
          <label className="text-sm font-bold">Broadcast to</label>
          <Controller
            control={control}
            name="broadcastTo"
            render={() => (
              <Select
                onChange={(option) => {
                  setBroadcastValue(option);
                }}
                closeMenuOnSelect={false}
                isMulti
                options={options}
                value={broadcastValue}
                isDisabled={createMessage.isLoading}
                classNames={{
                  control: () =>
                    "!input !input-bordered !focus:outline-offset-0 !h-auto !min-h-12",
                }}
              />
            )}
          />
          {errors.broadcastTo?.message && (
            <p className="text-xs text-red-400 text-right">
              {errors.broadcastTo?.message}
            </p>
          )}
        </div>
        <div className="flex flex-col w-full gap-2">
          <label className="text-sm font-bold">Broadcast At</label>
          <Input
            disabled={createMessage.isLoading}
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
            disabled={createMessage.isLoading}
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
        <div className="flex flex-row w-full items-center gap-2 col-span-2">
          <Checkbox
            id="custom-time"
            checked={customizeTime}
            onChange={() => setCustomizeTime(!customizeTime)}
          />
          <label
            htmlFor="custom-time"
            className="text-sm font-bold"
          >
            Custom time for specific branch?
          </label>
        </div>
        {customizeTime &&
          fields.map((item, i) => (
            <div
              className="flex flex-col w-full gap-2"
              key={item.id}
            >
              <label className="text-base font-medium">
                {mapBranch?.get(item.branchId ?? "")?.name}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col w-full gap-2">
                  <label className="text-sm font-medium">Broadcast At</label>
                  <Input
                    disabled={createMessage.isLoading}
                    type="datetime-local"
                    placeholder="Enter Name"
                    {...register(`branches.${i}.broadcastAt`)}
                  />
                  {errors.branches?.[i]?.broadcastAt?.message && (
                    <p className="text-xs text-red-400 text-right">
                      {errors.branches?.[i]?.broadcastAt?.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label className="text-sm font-medium">Expired At</label>
                  <Input
                    disabled={createMessage.isLoading}
                    type="datetime-local"
                    placeholder="Enter Name"
                    {...register(`branches.${i}.expiredAt`)}
                  />
                  {errors.branches?.[i]?.expiredAt?.message && (
                    <p className="text-xs text-red-400 text-right">
                      {errors.branches?.[i]?.expiredAt?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        <div className="grid grid-cols-2 col-span-2 gap-2">
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-bold">Content Type</label>
            <DSelect
              {...register("contentType")}
              disabled={createMessage.isLoading}
            >
              <DSelect.Option value={ContentType.Text}>
                {ContentType.Text}
              </DSelect.Option>
              <DSelect.Option value={ContentType.Audio}>
                {ContentType.Audio}
              </DSelect.Option>
              <DSelect.Option value={ContentType.Video}>
                {ContentType.Video}
              </DSelect.Option>
            </DSelect>
          </div>
          {contentType === ContentType.Audio ||
          contentType === ContentType.Video ? (
            <div className="flex flex-col w-full gap-2">
              <label className="text-sm font-bold">Content</label>
              <input
                disabled={createMessage.isLoading}
                type="file"
                accept={
                  contentType === ContentType.Audio ? "audio/*" : "video/*"
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
              initialValue={"<p>Write your message...</p>"}
              disabled={createMessage.isLoading}
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
        <div className="w-full flex flex-col justify-end items-end gap-2 col-span-2">
          <Button
            type="submit"
            color="success"
            disabled={createMessage.isLoading}
            loading={createMessage.isLoading}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateMessage;
