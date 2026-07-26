export async function GET(request) {
  try {
    const dropboxToken = await getDropboxToken(request)
    const { searchParams } = new URL(request.url)

    const queen = searchParams.get("queen")
    const season = searchParams.get("season")

    if (!queen || !season) {
      return Response.json(
        { error: "Missing queen or season" },
        { status: 400 }
      )
    }

    const path = buildPath(queen, season)

    const imageLink = await checkSharedLink(request, dropboxToken, path)

    return Response.json({ link: imageLink })

  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}

function buildPath(queen, season) {
  return `/DragRaceImages/${season}/${queen}${season}CastMug`
}

async function getDropboxToken(request){
  const origin = new URL(request.url).origin

  const tokenResponse = await fetch(`${origin}/api/dropbox/token`)

  if (!tokenResponse.ok) {
    throw new Error("Error getting dropbox token: " + tokenResponse.error);
  }
  const tokenData = await tokenResponse.json()
  return tokenData.access_token
}

async function checkSharedLink(request, dropboxToken, path){
  const res = await fetch(
    "https://api.dropboxapi.com/2/sharing/list_shared_links",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dropboxToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        path
      })
    }
  )

  const sharedLink = await res.json()
  return sharedLink.links[0].url.replace("dl=0", "raw=1")
}
/*
async function createImageSharedLink(request, dropboxToken, path){
  const res = await fetch(
    "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dropboxToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        path
      })
    }
  )
      
  var imageUrl = await res.json()
  console.log(imageUrl)
  return imageUrl.url.replace("dl=0", "raw=1")
}*/