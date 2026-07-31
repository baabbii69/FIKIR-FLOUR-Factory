"""Lists translation keys present in Amharic but missing in Afan Oromo."""
import io
import re

PAT = re.compile(r'^\s{2}"([^"]+)":\s*\n?\s*"((?:[^"\\]|\\.)*)"', re.M)


def parse(path):
    return dict(PAT.findall(io.open(path, encoding="utf8").read()))


am = parse("src/i18n/am.ts")
om = parse("src/i18n/om.ts")
gap = [k for k in am if k not in om]
prod = [k for k in gap if k.startswith("prod.")]
foot = [k for k in gap if k.startswith("footer.")]
other = [k for k in gap if not k.startswith(("prod.", "footer."))]

print(f"AM {len(am)} keys | OM {len(om)} keys")
print(f"missing in OM: {len(gap)}  ({len(prod)} product, {len(foot)} footer, {len(other)} other)\n")

slugs = sorted({k.split(".")[1] for k in prod})
print(f"products lacking Oromo ({len(slugs)}): {', '.join(slugs)}\n")

print("footer keys lacking Oromo:")
for k in sorted(foot):
    print(f"  {k:<30} {am.get(k, '')}")
if other:
    print("\nother:")
    for k in sorted(other):
        print(f"  {k:<30} {am.get(k, '')}")
