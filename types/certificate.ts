export interface ProductInfo {
  name: string;
  serial_no: string;
}

export interface OwnerInfo {
  full_name: string;
  address: string;
}

// 这里使用你习惯的命名：transfer 和 repair
export interface TransferRecord {
  date: string;
  assignee: string; // 受让人
}

export interface RepairRecord {
  date: string;
  issue: string; // 维修问题
  technician: string; // 维修人员
}

export interface CertificateData {
  uid: string;
  product: ProductInfo;
  owner: OwnerInfo;
  transfers: TransferRecord[]; // 使用习惯命名
  repairs: RepairRecord[];     // 使用习惯命名
}