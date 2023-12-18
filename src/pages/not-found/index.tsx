import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const NotFound = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t("HR Monster | Beranda")}</title>
      </Helmet>
      <div className="h-screen w-full flex items-center justify-center">
        <p>404 Not found</p>
      </div>
    </>
  );
};


export default NotFound;
