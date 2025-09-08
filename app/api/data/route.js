import { NextResponse } from "next/server";

export async function GET() {
  const links = [
    {
      label: "Citrea",
      url: "https://discord.com/channels/1202156430430306304/1202190166845038672",
    },
    {
      label: "Union",
      url: "https://discord.com/channels/1158939416870522930/1158939841669640192",
    },
    {
      label: "Spicenet",
      url: "https://discord.com/channels/1361313022643142666/1361605741932187792",
    },
    {
      label: "Mycel",
      url: "https://discord.com/channels/1082271726613839892/1138928858926678066",
    },
    {
      label: "Pharos",
      url: "https://discord.com/channels/1270276651636232282/1306921018509754399"
    },
    {
      label: "Rialo",
      url: "https://discord.com/channels/1393211102577557544/1400494188054708286"
    },
    {
      label: "Seismic",
      url: "https://discord.com/channels/1343751435711414362/1343751437087150113"
    }
  ];

  return NextResponse.json({ links }, { status: 200 });
}

