export default {
  async fetch(request, env, ctx) {

    const url = new URL(request.url);


    // ==========================================
    // CORS / OPTIONS
    // ==========================================

    if (request.method === "OPTIONS") {

      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS"
        }
      });

    }


    // ==========================================
    // API: ثبت درخواست پروژه
    // ==========================================

    if (
      url.pathname === "/api/projects" &&
      request.method === "POST"
    ) {

      try {

        const data = await request.json();


        const {
          full_name,
          phone,
          brand,
          project_type,
          description,
          budget,
          start_time,
          instagram,
          website
        } = data;


        // اعتبارسنجی اطلاعات ضروری

        if (
          !full_name ||
          !phone ||
          !description
        ) {

          return jsonResponse(
            {
              success: false,
              message: "اطلاعات ضروری کامل نیست."
            },
            400
          );

        }


        // ذخیره در D1

        const result = await env.DB
          .prepare(`
            INSERT INTO project_requests
            (
              full_name,
              phone,
              brand,
              project_type,
              description,
              budget,
              start_time,
              instagram,
              website
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `)
          .bind(
            full_name.trim(),
            phone.trim(),
            brand?.trim() || null,
            project_type || null,
            description.trim(),
            budget || null,
            start_time || null,
            instagram?.trim() || null,
            website?.trim() || null
          )
          .run();


        return jsonResponse({
          success: true,
          message: "درخواست پروژه با موفقیت ثبت شد.",
          id: result.meta?.last_row_id || null
        });


      } catch (error) {

        console.error(
          "PROJECT_FORM_ERROR:",
          error
        );


        return jsonResponse(
          {
            success: false,
            message: "ثبت درخواست انجام نشد."
          },
          500
        );

      }

    }


    // ==========================================
    // API: دریافت درخواست‌ها
    // ==========================================

    if (
      url.pathname === "/api/projects" &&
      request.method === "GET"
    ) {

      try {

        const result = await env.DB
          .prepare(`
            SELECT
              id,
              full_name,
              phone,
              brand,
              project_type,
              description,
              budget,
              start_time,
              instagram,
              website,
              status,
              created_at
            FROM project_requests
            ORDER BY id DESC
          `)
          .all();


        return jsonResponse({
          success: true,
          projects: result.results || []
        });


      } catch (error) {

        console.error(
          "PROJECT_LIST_ERROR:",
          error
        );


        return jsonResponse(
          {
            success: false,
            message: "دریافت درخواست‌ها انجام نشد."
          },
          500
        );

      }

    }


    // ==========================================
    // API: تغییر وضعیت پروژه
    // ==========================================

    if (
      url.pathname === "/api/projects/status" &&
      request.method === "POST"
    ) {

      try {

        const data = await request.json();


        const {
          id,
          status
        } = data;


        const allowedStatuses = [
          "new",
          "reviewing",
          "completed"
        ];


        if (
          !id ||
          !allowedStatuses.includes(status)
        ) {

          return jsonResponse(
            {
              success: false,
              message: "اطلاعات وضعیت نامعتبر است."
            },
            400
          );

        }


        await env.DB
          .prepare(`
            UPDATE project_requests
            SET status = ?
            WHERE id = ?
          `)
          .bind(
            status,
            id
          )
          .run();


        return jsonResponse({
          success: true,
          message: "وضعیت درخواست تغییر کرد."
        });


      } catch (error) {

        console.error(
          "PROJECT_STATUS_ERROR:",
          error
        );


        return jsonResponse(
          {
            success: false,
            message: "تغییر وضعیت انجام نشد."
          },
          500
        );

      }

    }


    // ==========================================
    // API: حذف درخواست پروژه
    // ==========================================

    if (
      url.pathname === "/api/projects" &&
      request.method === "DELETE"
    ) {

      try {

        const id = url.searchParams.get("id");


        if (!id) {

          return jsonResponse(
            {
              success: false,
              message: "شناسه درخواست مشخص نشده است."
            },
            400
          );

        }


        const result = await env.DB
          .prepare(`
            DELETE FROM project_requests
            WHERE id = ?
          `)
          .bind(id)
          .run();


        if (
          !result.meta ||
          result.meta.changes === 0
        ) {

          return jsonResponse(
            {
              success: false,
              message: "درخواست موردنظر پیدا نشد."
            },
            404
          );

        }


        return jsonResponse({
          success: true,
          message: "درخواست با موفقیت حذف شد."
        });


      } catch (error) {

        console.error(
          "PROJECT_DELETE_ERROR:",
          error
        );


        return jsonResponse(
          {
            success: false,
            message: "حذف درخواست انجام نشد."
          },
          500
        );

      }

    }


    // ==========================================
    // STATIC ASSETS
    // ==========================================

    return env.ASSETS.fetch(request);

  }
};


// ==========================================
// JSON RESPONSE
// ==========================================

function jsonResponse(
  data,
  status = 200
) {

  return new Response(
    JSON.stringify(data),
    {
      status,

      headers: {
        "Content-Type":
          "application/json; charset=UTF-8",

        "Access-Control-Allow-Origin": "*",

        "Access-Control-Allow-Headers":
          "Content-Type",

        "Access-Control-Allow-Methods":
          "GET, POST, DELETE, OPTIONS"
      }
    }
  );

}
