export default {
  async fetch(request, env, ctx) {

    const url = new URL(request.url);


    // ==========================================
    // ROUTES
    // ==========================================

    const isAdminPage =
      url.pathname === "/admin" ||
      url.pathname.startsWith("/admin/");


    const isAdminApi =
      (
        url.pathname === "/api/projects" &&
        (
          request.method === "GET" ||
          request.method === "DELETE"
        )
      ) ||
      (
        url.pathname === "/api/projects/status" &&
        request.method === "POST"
      );


    // ==========================================
    // ADMIN AUTH
    // ==========================================

    if (isAdminPage || isAdminApi) {

      const authResult =
        await authenticateAdmin(request, env);


      if (!authResult.authorized) {

        return new Response(
          "Authentication required.",
          {
            status: 401,

            headers: {
              "WWW-Authenticate":
                'Basic realm="MR.DANESHVAAR Admin", charset="UTF-8"',

              "Cache-Control":
                "no-store"
            }
          }
        );

      }

    }



    // ==========================================
    // CORS
    // ==========================================

    if (request.method === "OPTIONS") {

      return new Response(null, {

        status: 204,

        headers: {

          "Access-Control-Allow-Origin":
            "*",

          "Access-Control-Allow-Headers":
            "Content-Type",

          "Access-Control-Allow-Methods":
            "GET, POST, DELETE, OPTIONS"

        }

      });

    }



    // ==========================================
    // PUBLIC PROJECT FORM
    // ==========================================


    if (
      url.pathname === "/api/projects" &&
      request.method === "POST"
    ) {


      try {


        const data =
          await request.json();


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



        if (
          !full_name ||
          !phone ||
          !description
        ) {


          return jsonResponse({

            success:false,

            message:
              "اطلاعات ضروری کامل نیست."

          },400);


        }



        const result =
          await env.DB
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

          success:true,

          message:
            "درخواست پروژه با موفقیت ثبت شد.",

          id:
            result.meta?.last_row_id || null

        });



      } catch(error) {


        console.error(
          "PROJECT_FORM_ERROR:",
          error
        );


        return jsonResponse({

          success:false,

          message:
            "ثبت درخواست انجام نشد."

        },500);


      }


    }
    // ==========================================
// API: APP PROJECT LIST
// بدون نیاز به ورود
// مخصوص Website 2 APK Builder
// ==========================================

if (
  url.pathname === "/api/app/projects" &&
  request.method === "GET"
) {

  try {

    const result =
      await env.DB
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

      success:true,

      projects:
        result.results || []

    });



  } catch(error) {


    console.error(
      "APP_PROJECT_LIST_ERROR:",
      error
    );


    return jsonResponse({

      success:false,

      message:
        "خطا در دریافت اطلاعات"

    },500);


  }

}
    // ==========================================
// API: دریافت درخواست‌ها برای پنل مدیریت
// ==========================================

if (
  url.pathname === "/api/projects" &&
  request.method === "GET"
) {

  try {

    const result =
      await env.DB
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

      success:true,

      projects:
        result.results || []

    });


  } catch(error) {


    console.error(
      "PROJECT_LIST_ERROR:",
      error
    );


    return jsonResponse({

      success:false,

      message:
        "دریافت درخواست‌ها انجام نشد."

    },500);


  }

}



// ==========================================
// تغییر وضعیت پروژه
// ==========================================

if (
  url.pathname === "/api/projects/status" &&
  request.method === "POST"
) {

  try {


    const data =
      await request.json();


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

      return jsonResponse({

        success:false,

        message:
          "اطلاعات وضعیت نامعتبر است."

      },400);

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

      success:true,

      message:
        "وضعیت درخواست تغییر کرد."

    });



  } catch(error) {


    console.error(
      "PROJECT_STATUS_ERROR:",
      error
    );


    return jsonResponse({

      success:false,

      message:
        "تغییر وضعیت انجام نشد."

    },500);


  }

}





// ==========================================
// حذف درخواست
// ==========================================

if (
  url.pathname === "/api/projects" &&
  request.method === "DELETE"
) {


  try {


    const id =
      url.searchParams.get("id");



    if(!id){

      return jsonResponse({

        success:false,

        message:
          "شناسه درخواست مشخص نشده است."

      },400);

    }



    const result =
      await env.DB
      .prepare(`

        DELETE FROM project_requests

        WHERE id = ?

      `)

      .bind(id)

      .run();



    return jsonResponse({

      success:true,

      message:
        "درخواست حذف شد."

    });



  } catch(error) {


    console.error(
      "PROJECT_DELETE_ERROR:",
      error
    );


    return jsonResponse({

      success:false,

      message:
        "حذف انجام نشد."

    },500);


  }


}





// ==========================================
// فایل‌های سایت
// ==========================================

return env.ASSETS.fetch(request);


}







// ==========================================
// ADMIN AUTH
// ==========================================

async function authenticateAdmin(
  request,
  env
) {


const authorization =
  request.headers.get("Authorization");



if(!authorization){

return {
authorized:false
};

}



if(
 !authorization.startsWith("Basic ")
){

return {
authorized:false
};

}



try{


const encoded =
authorization.slice(6).trim();



const decoded =
atob(encoded);



const separator =
decoded.indexOf(":");



if(separator === -1){

return {
authorized:false
};

}



const username =
decoded.slice(0,separator);



const password =
decoded.slice(separator+1);



const usernameMatch =
timingSafeEqual(
username,
env.ADMIN_USERNAME
);



const passwordMatch =
timingSafeEqual(
password,
env.ADMIN_PASSWORD
);



return {

authorized:
usernameMatch &&
passwordMatch

};



}catch(error){


return {

authorized:false

};


}


}







// ==========================================
// SAFE COMPARE
// ==========================================

function timingSafeEqual(a,b){


if(
typeof a !== "string" ||
typeof b !== "string"
){

return false;

}



if(
a.length !== b.length
){

return false;

}



let result = 0;



for(
let i=0;
i<a.length;
i++
){

result |=
a.charCodeAt(i)
^
b.charCodeAt(i);

}



return result === 0;


}








// ==========================================
// JSON RESPONSE
// ==========================================

function jsonResponse(
data,
status=200
){

return new Response(

JSON.stringify(data),

{

status,

headers:{

"Content-Type":
"application/json; charset=UTF-8",

"Access-Control-Allow-Origin":
"*",

"Access-Control-Allow-Headers":
"Content-Type",

"Access-Control-Allow-Methods":
"GET, POST, DELETE, OPTIONS",

"Cache-Control":
"no-store"

}

}

);


}
