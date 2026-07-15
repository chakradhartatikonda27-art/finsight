from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from enum import Enum

class Severity(str, Enum):
    CRITICAL = "CRITICAL"
    WARNING  = "WARNING"
    INFO     = "INFO"

class ValidationFailureOut(BaseModel):
    code: str
    severity: Severity
    message: str
    diff: Optional[str] = None
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    period: Optional[str] = None

class ValidationResultOut(BaseModel):
    upload_id: str
    is_clean: bool
    passed: List[str]
    failures: List[ValidationFailureOut]
    summary: str

class NLQRequest(BaseModel):
    question: str
    upload_id: Optional[str] = None

class PLLineItem(BaseModel):
    mis_head: str
    amount: str
    pct: Optional[str] = None

class PLReport(BaseModel):
    period: str
    company: str
    total_revenue: str
    gross_profit: str
    gp_margin_pct: str
    ebitda: str
    ebitda_margin_pct: str
    pat: str
    pat_margin_pct: str
    line_items: List[PLLineItem] = []
    validation: Dict[str, str] = {}

class BSReport(BaseModel):
    as_at_date: str
    company: str
    total_assets: str
    total_liabilities_equity: str
    balance_diff: str
    bs001_status: str
    assets: Dict[str, str] = {}
    liabilities: Dict[str, str] = {}

class CFReport(BaseModel):
    period: str
    opening_cash: str
    operating_cash_flow: str
    investing_cash_flow: str
    financing_cash_flow: str
    net_cash_movement: str
    closing_cash: str
    reconciliation_diff: str
    cf001_status: str

class SitePL(BaseModel):
    cost_centre: str
    revenue: str
    gp_margin_pct: str
    ebitda_margin_pct: str
    status: str

class SitePLReport(BaseModel):
    sites: List[SitePL]

class BvALine(BaseModel):
    mis_head: str
    budget: str
    actual: str
    variance: str
    variance_pct: str
    status: str

class BvAReport(BaseModel):
    period: str
    lines: List[BvALine]

class VoucherOut(BaseModel):
    id: Optional[str] = None
    txn_date: str
    voucher_type: str
    voucher_no: Optional[str] = None
    ledger_name: str
    debit: str
    credit: str
    cost_centre: Optional[str] = None
    narration: Optional[str] = None

class BSLineItem(BaseModel):
    label: str
    value: str
    category: str

class MappingResult(BaseModel):
    total_ledgers: int
    confirmed: int
    pending_ca_review: int
    unmapped: int
    message: str
    sample_mappings: List[Dict[str, Any]] = []

class NLQResponse(BaseModel):
    question: str
    answer: str
    data_context: Optional[Dict[str, Any]] = None
    source: str

class Company(BaseModel):
    id: str
    name: str
    tally_format: str = "standard"
    fiscal_year: str = "2025-26"
    subscription_tier: str = "growth"

class CFOKPIs(BaseModel):
    revenue: str
    gross_profit: str
    gp_margin_pct: str
    ebitda: str
    ebitda_margin_pct: str
    pat: str
    pat_margin_pct: str
    cash: str
    debtors: str
    creditors: str
    hdfc_od_pct: float = 0
    kvb_od_pct: float = 0
    combined_od_pct: float = 0
    period: str
    validation_status: str = "CLEAN"
