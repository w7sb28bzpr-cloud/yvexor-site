from django.db import migrations

TABLES = ['core_wallettransaction','core_shopevent','core_orderitem','core_orderstatushistory','core_paymentstatushistory']


def install(apps, schema_editor):
    if schema_editor.connection.vendor != 'postgresql':
        return  # SQLite is development-only; financial deployment requires PostgreSQL.
    schema_editor.execute("CREATE FUNCTION yvexor_immutable_history() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'YVEXOR history is immutable'; END; $$")
    for table in TABLES:
        schema_editor.execute(f'CREATE TRIGGER immutable_history BEFORE UPDATE OR DELETE ON {table} FOR EACH ROW EXECUTE FUNCTION yvexor_immutable_history()')


def uninstall(apps, schema_editor):
    if schema_editor.connection.vendor != 'postgresql':
        return
    for table in TABLES:
        schema_editor.execute(f'DROP TRIGGER immutable_history ON {table}')
    schema_editor.execute('DROP FUNCTION yvexor_immutable_history()')


class Migration(migrations.Migration):
    dependencies = [('core','0004_category_order_orderstatushistory_paymentrequest_and_more')]
    operations = [migrations.RunPython(install,uninstall)]
