view: demo {
  sql_table_name: `gcp_project.gcp_datesets.gcp_table`

  # need name your date dimension as _date
  dimension_group: _date {
    type: time
    timeframes: [
      raw,
      date,
      week,
      month,
      quarter,
      year
    ]
    convert_tz: no
    datatype: date
    sql: ${TABLE}._date ;;
  }
  
  measure: num_unique_cases_email {
    type: sum
    label: "# Email Cases"
    sql: ${TABLE}.num_unique_cases_Email ;;
  }

}